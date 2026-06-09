/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce tab indentation in CSS files.',
			category: 'CKEditor5'
		},
		fixable: 'whitespace',
		schema: [],
		messages: {
			incorrectIndent: 'Incorrect indentation: expected {{expected}}, found {{actual}}.'
		}
	},

	create( context ) {
		const sourceCode = context.sourceCode;

		// Expected indent for each line is the sum of two contributions:
		//   - blockDepth: one tab per nested `{ ... }` level.
		//   - parenDepth: one extra tab for each multi-line `( ... )` enclosing the line.
		const blockDepth = new Map();
		const parenDepth = new Map();
		const parenCloseLines = new Set();
		const rawLines = new Set();
		const declarationContinuationLines = new Set();

		let depth = 0;
		let currentDeclaration = null;
		let functionDepth = 0;

		/**
		 * Records that lines strictly between `(` and `)` get one extra tab of
		 * expected indent. Single-line constructs contribute nothing. The line the
		 * `)` sits on is remembered so its indentation (at the outer depth) is enforced.
		 */
		function addParenContribution( node ) {
			if ( node.loc.start.line >= node.loc.end.line ) {
				return;
			}

			for ( let l = node.loc.start.line + 1; l <= node.loc.end.line - 1; l++ ) {
				parenDepth.set( l, ( parenDepth.get( l ) || 0 ) + 1 );
			}

			parenCloseLines.add( node.loc.end.line );
		}

		return {
			Block( node ) {
				depth++;

				const innerStart = node.loc.start.line + 1;
				const innerEnd = node.loc.end.line - 1;

				for ( let l = innerStart; l <= innerEnd; l++ ) {
					blockDepth.set( l, depth );
				}
			},

			'Block:exit'() {
				depth--;
			},

			Function( node ) {
				functionDepth++;
				addParenContribution( node );
			},

			'Function:exit'() {
				functionDepth--;
			},

			/**
			 * Pseudo-class selectors with arguments (`:not(...)`, `:is(...)`, ...) carry
			 * their own parens and contribute to indent the same way as functions.
			 */
			PseudoClassSelector( node ) {
				addParenContribution( node );
			},

			Declaration( node ) {
				currentDeclaration = node;

				if ( node.loc.start.line >= node.loc.end.line ) {
					return;
				}

				for ( let l = node.loc.start.line + 1; l <= node.loc.end.line; l++ ) {
					declarationContinuationLines.add( l );
				}
			},

			'Declaration:exit'() {
				currentDeclaration = null;
			},

			/**
			 * `@eslint/css` exposes two unrelated shapes as `Raw`: custom-property values
			 * (`--foo: ...`), which can still carry paren-bearing function calls we want
			 * indent enforced on, and tolerant-parse fallback (e.g. `& { ... }` inside
			 * `@starting-style`), which has no AST to anchor against.
			 */
			Raw( node ) {
				const property = currentDeclaration && typeof currentDeclaration.property === 'string' ? currentDeclaration.property : '';

				if ( property.startsWith( '--' ) ) {
					scanRawParens( node, parenDepth, parenCloseLines );

					return;
				}

				if ( functionDepth > 0 ) {
					return;
				}

				for ( let l = node.loc.start.line + 1; l <= node.loc.end.line; l++ ) {
					rawLines.add( l );
				}
			},

			'StyleSheet:exit'() {
				const lines = sourceCode.lines;

				// Continuation lines of a multi-line block comment legitimately start
				// with ` *` (the canonical license-header pattern). Skip them.
				const commentContinuationLines = new Set();

				for ( const comment of sourceCode.comments || [] ) {
					for ( let l = comment.loc.start.line + 1; l <= comment.loc.end.line; l++ ) {
						commentContinuationLines.add( l );
					}
				}

				for ( let i = 0; i < lines.length; i++ ) {
					const lineNumber = i + 1;
					const line = lines[ i ];

					if ( /^\s*$/.test( line ) ) {
						continue;
					}

					if ( commentContinuationLines.has( lineNumber ) ) {
						continue;
					}

					if ( rawLines.has( lineNumber ) ) {
						continue;
					}

					// The closing line of a multi-line paren must be enforced (at the outer depth),
					// but only when `)` starts the line - a `)` sharing a line with content is a
					// normal inner line.
					const isParenCloseLine = parenCloseLines.has( lineNumber ) && /^\s*\)/.test( line );

					// Declaration continuation lines without a paren contribution
					// (multi-line strings, chained values) are not enforced - indent is
					// only checked inside parens and on the closing paren line.
					if ( declarationContinuationLines.has( lineNumber ) && !parenDepth.has( lineNumber ) && !isParenCloseLine ) {
						continue;
					}

					const expectedDepth = ( blockDepth.get( lineNumber ) ?? 0 ) + ( parenDepth.get( lineNumber ) ?? 0 );
					const leading = ( line.match( /^[\t ]*/ ) || [ '' ] )[ 0 ];
					const expectedLeading = '\t'.repeat( expectedDepth );

					if ( leading === expectedLeading ) {
						continue;
					}

					context.report( {
						loc: {
							start: { line: lineNumber, column: 1 },
							end: { line: lineNumber, column: leading.length + 1 }
						},
						messageId: 'incorrectIndent',
						data: {
							expected: describeIndent( expectedLeading ),
							actual: describeIndent( leading )
						},
						fix( fixer ) {
							// CSS source columns are 1-based, so column 1 is the line start.
							const lineStart = sourceCode.getIndexFromLoc( { line: lineNumber, column: 1 } );

							return fixer.replaceTextRange( [ lineStart, lineStart + leading.length ], expectedLeading );
						}
					} );
				}
			}
		};
	}
};

function describeIndent( str ) {
	if ( str === '' ) {
		return 'none';
	}

	const tabs = ( str.match( /\t/g ) || [] ).length;
	const spaces = ( str.match( / /g ) || [] ).length;
	const parts = [];

	if ( tabs ) {
		parts.push( formatPlural( 'tab', tabs ) );
	}

	if ( spaces ) {
		parts.push( formatPlural( 'space', spaces ) );
	}

	return parts.join( ' and ' );
}

function formatPlural( word, number ) {
	return `${ number } ${ word }${ number === 1 ? '' : 's' }`;
}

/**
 * Same paren-depth model as `addParenContribution`, but driven by a character
 * scan since Raw has no AST. Strings and CSS block comments are skipped so
 * their parens don't skew the depth.
 */
function scanRawParens( rawNode, parenDepth, parenCloseLines ) {
	const text = typeof rawNode.value === 'string' ? rawNode.value : '';

	if ( !text ) {
		return;
	}

	let line = rawNode.loc.start.line;
	let stringDelimiter = null;
	let inComment = false;
	const openLineStack = [];

	for ( let i = 0; i < text.length; i++ ) {
		const ch = text[ i ];

		if ( ch === '\n' ) {
			line++;

			continue;
		}

		if ( inComment ) {
			if ( ch === '*' && text[ i + 1 ] === '/' ) {
				inComment = false;
				i++;
			}

			continue;
		}

		if ( stringDelimiter ) {
			if ( ch === '\\' ) {
				// The escaped char is skipped via i++ below; if it is a newline, the loop's
				// top-of-body line counter never sees it, so count it here.
				if ( text[ i + 1 ] === '\n' ) {
					line++;
				}

				i++;
			} else if ( ch === stringDelimiter ) {
				stringDelimiter = null;
			}

			continue;
		}

		if ( ch === '/' && text[ i + 1 ] === '*' ) {
			inComment = true;
			i++;
		} else if ( ch === '"' || ch === '\'' ) {
			stringDelimiter = ch;
		} else if ( ch === '(' ) {
			openLineStack.push( line );
		} else if ( ch === ')' ) {
			const openLine = openLineStack.pop();

			if ( openLine !== undefined && openLine < line ) {
				for ( let l = openLine + 1; l <= line - 1; l++ ) {
					parenDepth.set( l, ( parenDepth.get( l ) || 0 ) + 1 );
				}

				parenCloseLines.add( line );
			}
		}
	}
}
