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

				let firstIdentifier = null;

				for ( const child of node.children ) {
					if ( child.type === 'Identifier' ) {
						firstIdentifier = child;

						break;
					}
				}

				if ( !firstIdentifier ) {
					return;
				}

				const variableName = firstIdentifier.name;

				if ( variableName.startsWith( PREFIX ) ) {
					return;
				}

				if ( ignoredVariableSubstrings.some( ignored => variableName.includes( ignored ) ) ) {
					return;
				}

				context.report( {
					node,
					messageId: 'invalidVariable'
				} );
			}
		};
	}
};
