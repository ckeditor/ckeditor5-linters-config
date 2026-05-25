/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const SELECTOR = '.ck-content';
const PREFIX = '--ck-content-';
const IGNORED_VARIABLES = [
	'-suggestion-',
	'-comment-'
];

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				`Inside the '${ SELECTOR }' selector, only CSS variables prefixed with '${ PREFIX }' may be consumed via var(...).`,
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			invalidVariable:
				`Variables inside the '${ SELECTOR }' selector have to use the '${ PREFIX }*' prefix.`
		}
	},

	create( context ) {
		const sourceCode = context.sourceCode;
		const matchingRuleStack = [];

		function isMatchingSelector( ruleNode ) {
			const selectorText = sourceCode.getText( ruleNode.prelude );

			return selectorText.includes( SELECTOR );
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

			'Rule > Block Declaration'( node ) {
				const insideMatchingSelector = matchingRuleStack[ matchingRuleStack.length - 1 ];

				if ( !insideMatchingSelector ) {
					return;
				}

				const valueText = sourceCode.getText( node.value );

				if ( !valueText.includes( 'var(' ) ) {
					return;
				}

				const usesAllowedPrefix = new RegExp( `var\\(\\s*${ PREFIX }` ).test( valueText );

				if ( usesAllowedPrefix ) {
					return;
				}

				const isIgnored = IGNORED_VARIABLES.some( ignored => valueText.includes( ignored ) );

				if ( isIgnored ) {
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
