/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const cssTree = require( '@eslint/css-tree' );

const SELECTOR_CLASS = 'ck-content';
const PREFIX = `--${ SELECTOR_CLASS }-`;

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				`Inside the '.${ SELECTOR_CLASS }' selector, only CSS variables prefixed with '${ PREFIX }' may be consumed via var(...).`,
			category: 'CKEditor5'
		},
		schema: [
			{
				type: 'object',
				additionalProperties: false,
				properties: {
					ignoredVariableSubstrings: {
						type: 'array',
						items: {
							type: 'string'
						}
					}
				}
			}
		],
		messages: {
			invalidVariable:
				`Variables inside the '.${ SELECTOR_CLASS }' selector have to use the '${ PREFIX }*' prefix.`
		}
	},

	create( context ) {
		const [ { ignoredVariableSubstrings = [] } = {} ] = context.options;
		const matchingRuleStack = [];

		function isMatchingSelector( ruleNode ) {
			let found = false;

			cssTree.walk( ruleNode.prelude, sub => {
				if ( sub.type === 'ClassSelector' && sub.name === SELECTOR_CLASS ) {
					found = true;
				}
			} );

			return found;
		}

		function isInsideMatchingSelector() {
			return matchingRuleStack.length > 0 && matchingRuleStack[ matchingRuleStack.length - 1 ];
		}

		return {
			Rule( node ) {
				matchingRuleStack.push( isMatchingSelector( node ) || isInsideMatchingSelector() );
			},

			'Rule:exit'() {
				matchingRuleStack.pop();
			},

			'Rule > Block Declaration Function'( node ) {
				if ( !isInsideMatchingSelector() ) {
					return;
				}

				if ( typeof node.name !== 'string' || node.name.toLowerCase() !== 'var' ) {
					return;
				}

				const variableName = firstVariableName( node );

				if ( variableName === null || isAllowedVariable( variableName, ignoredVariableSubstrings ) ) {
					return;
				}

				context.report( {
					node,
					messageId: 'invalidVariable'
				} );
			},

			// `@eslint/css` exposes custom-property values (`--foo: ...`) and `var()` fallbacks
			// (`var(--x, ...)`) as a Raw token, so the visitor above never sees the `var()` calls inside them.
			'Rule > Block Declaration Raw'( node ) {
				if ( !isInsideMatchingSelector() || !node.loc ) {
					return;
				}

				checkRawVariables( context, node.value, node.loc.start, ignoredVariableSubstrings );
			}
		};
	}
};

function isAllowedVariable( variableName, ignoredVariableSubstrings ) {
	if ( variableName.startsWith( PREFIX ) ) {
		return true;
	}

	return ignoredVariableSubstrings.some( ignored => variableName.includes( ignored ) );
}

function firstVariableName( functionNode ) {
	for ( const child of functionNode.children ) {
		if ( child.type === 'Identifier' ) {
			return child.name;
		}
	}

	return null;
}

function checkRawVariables( context, text, anchor, ignoredVariableSubstrings ) {
	if ( typeof text !== 'string' || !text.trim() ) {
		return;
	}

	let ast;

	try {
		ast = cssTree.parse( text, { context: 'value', positions: true } );
	} catch {
		return;
	}

	cssTree.walk( ast, node => {
		// css-tree keeps nested `var()` fallbacks as their own Raw (e.g. `var(--a, var(--bad))`),
		// so recurse into them to reach every `var()` call.
		if ( node.type === 'Raw' ) {
			checkRawVariables( context, node.value, translatePosition( node.loc.start, anchor ), ignoredVariableSubstrings );

			return;
		}

		if ( node.type !== 'Function' || typeof node.name !== 'string' || node.name.toLowerCase() !== 'var' ) {
			return;
		}

		const variableName = firstVariableName( node );

		if ( variableName === null || isAllowedVariable( variableName, ignoredVariableSubstrings ) ) {
			return;
		}

		context.report( {
			loc: {
				start: translatePosition( node.loc.start, anchor ),
				end: translatePosition( node.loc.end, anchor )
			},
			messageId: 'invalidVariable'
		} );
	} );
}

/**
 * Line 1 of the sub-parsed value starts mid-file at `anchor.column`; later lines
 * start at file column 1, so only line 1 needs the column anchor shift.
 */
function translatePosition( pos, anchor ) {
	if ( pos.line === 1 ) {
		return { line: anchor.line, column: anchor.column + pos.column - 1 };
	}

	return { line: anchor.line + pos.line - 1, column: pos.column };
}
