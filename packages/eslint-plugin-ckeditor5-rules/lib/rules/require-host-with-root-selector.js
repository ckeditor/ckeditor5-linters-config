/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/**
 * A `:root` selector matches nothing inside a shadow root, so a stylesheet that anchors its custom
 * properties on `:root` alone leaves every one of them undefined for an editor mounted in one. Pairing
 * it with `:host` – which matches the shadow host from inside the shadow tree, and nothing in the light
 * DOM – makes a single stylesheet resolve its tokens in both contexts:
 *
 * ```css
 * :root,
 * :host {
 * 	--ck-some-token: 1px;
 * }
 * ```
 *
 * Only a bare `:host` satisfies the rule; a parameterized `:host(…)` targets specific hosts rather than
 * the root scope.
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require every `:root` selector to be paired with `:host` so it applies inside a shadow root.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		schema: [],
		messages: {
			missingHostSelector: 'A `:root` selector must be paired with `:host`, or its declarations will not ' +
				'apply inside a shadow root.'
		}
	},

	create( context ) {
		const sourceCode = context.sourceCode;

		return {
			Rule( node ) {
				if ( node.prelude?.type !== 'SelectorList' ) {
					return;
				}

				const selectors = [ ...node.prelude.children ];
				const rootSelector = selectors.find( selector => isBarePseudoClass( selector, 'root' ) );

				if ( !rootSelector || selectors.some( selector => isBarePseudoClass( selector, 'host' ) ) ) {
					return;
				}

				context.report( {
					node: rootSelector,
					messageId: 'missingHostSelector',
					fix( fixer ) {
						// The `:host` selector goes on its own line, matching how the stylesheets format
						// selector lists, indented like the `:root` selector it follows.
						const line = sourceCode.lines[ rootSelector.loc.start.line - 1 ] || '';
						const indent = line.slice( 0, line.length - line.trimStart().length );
						const insertAt = sourceCode.getIndexFromLoc( rootSelector.loc.end );

						return fixer.insertTextAfterRange( [ insertAt, insertAt ], `,\n${ indent }:host` );
					}
				} );
			}
		};
	}
};

function isBarePseudoClass( selector, name ) {
	const nodes = [ ...selector.children ];

	return nodes.length === 1 &&
		nodes[ 0 ].type === 'PseudoClassSelector' &&
		nodes[ 0 ].name.toLowerCase() === name &&
		// A parameterized `:host(…)`/`:root(…)` carries its argument as children.
		!nodes[ 0 ].children;
}
