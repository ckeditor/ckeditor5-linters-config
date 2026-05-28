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
		const rawLines = new Set();
		const declarationContinuationLines = new Set();

		let depth = 0;

		/**
		 * Records that lines strictly between `(` and `)` get one extra tab of
		 * expected indent. Single-line constructs contribute nothing.
		 */
		function addParenContribution( node ) {
			if ( node.loc.start.line >= node.loc.end.line ) {
				return;
			}

			for ( let l = node.loc.start.line + 1; l <= node.loc.end.line - 1; l++ ) {
				parenDepth.set( l, ( parenDepth.get( l ) || 0 ) + 1 );
			}
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
				addParenContribution( node );
			},

			/**
			 * Pseudo-class selectors with arguments (`:not(...)`, `:is(...)`, ...) carry
			 * their own parens and contribute to indent the same way as functions.
			 */
			PseudoClassSelector( node ) {
				addParenContribution( node );
			},

			Declaration( node ) {
				if ( node.loc.start.line >= node.loc.end.line ) {
					return;
				}

				for ( let l = node.loc.start.line + 1; l <= node.loc.end.line; l++ ) {
					declarationContinuationLines.add( l );
				}
			},

			/**
			 * Custom-property values (`--foo: ...`) and tolerant-parse fallback content
			 * (e.g. `& { ... }` inside `@starting-style`) come through as Raw blobs. Their
			 * inner lines are skipped from the indent check - there is no AST to anchor
			 * an expected indent on.
			 */
			Raw( node ) {
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

					// Declaration continuation lines without a paren contribution
					// (multi-line strings, chained values) are not enforced - indent is
					// only checked inside parens.
					if ( declarationContinuationLines.has( lineNumber ) && !parenDepth.has( lineNumber ) ) {
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
