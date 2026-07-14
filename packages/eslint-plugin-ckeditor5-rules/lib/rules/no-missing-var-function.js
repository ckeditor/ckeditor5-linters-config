/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const cssTree = require( '@eslint/css-tree' );

// Properties whose values legitimately contain dashed identifiers that are not custom property
// references: author-defined transition targets and the `<dashed-ident>`-based naming properties
// (anchor positioning, scroll-driven animations, view transitions).
//
// Deliberately hand-picked instead of derived from the css-tree grammar: every `<custom-ident>`
// property (`animation-name`, `grid-area`, ...) also accepts dashed identifiers there, yet a
// bare `--x` in those is almost certainly a missing `var()`.
const PROPERTIES_WITH_DASHED_IDENTS = new Set( [
	'transition',
	'transition-property',
	'will-change',
	'anchor-name',
	'position-anchor',
	'scroll-timeline',
	'scroll-timeline-name',
	'view-timeline',
	'view-timeline-name',
	'timeline-scope',
	'animation-timeline',
	'view-transition-name'
] );

const LONE_CUSTOM_PROPERTY_PATTERN = /^--[\w-]+$/;

/**
 * Local implementation of stylelint's `custom-property-no-missing-var-function`:
 * https://stylelint.io/user-guide/rules/custom-property-no-missing-var-function/
 *
 * Unlike the original, which only reports custom properties declared in the same file, this
 * rule flags every bare `--*` reference - our custom properties are defined centrally in
 * other files, so the same-source scoping would make the rule a no-op.
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow custom-property references that are missing the var() function.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			missingVarFunction: '\'{{ name }}\' is a custom property reference - wrap it in \'var({{ name }})\'.'
		}
	},

	create( context ) {
		return {
			Declaration( node ) {
				if ( typeof node.property !== 'string' || !node.value ) {
					return;
				}

				if ( PROPERTIES_WITH_DASHED_IDENTS.has( node.property.toLowerCase() ) ) {
					return;
				}

				// Custom-property values are exposed as an opaque Raw token. Flag the clear-cut
				// mistake only: a value that is exactly one bare custom-property name (`--a: --b`).
				if ( node.value.type === 'Raw' ) {
					const text = String( node.value.value ).trim();

					if ( node.property.startsWith( '--' ) && LONE_CUSTOM_PROPERTY_PATTERN.test( text ) ) {
						context.report( {
							node: node.value,
							messageId: 'missingVarFunction',
							data: { name: text }
						} );
					}

					return;
				}

				cssTree.walk( node.value, function( child ) {
					// `var()` fallbacks are exposed as a Raw token (`var(--a, --b)`), so bare
					// references inside them must be recovered by re-parsing the raw text.
					if ( child.type === 'Raw' ) {
						checkRawFallback( context, child );

						return;
					}

					if ( child.type !== 'Identifier' || !String( child.name ).startsWith( '--' ) ) {
						return;
					}

					// The first argument of `var()` is the reference itself.
					if ( this.function && String( this.function.name ).toLowerCase() === 'var' ) {
						return;
					}

					context.report( {
						node: child,
						messageId: 'missingVarFunction',
						data: { name: child.name }
					} );
				} );
			}
		};
	}
};

/**
 * Flags a `var()` fallback that consists of a lone bare custom-property name, for example the
 * `--b` in `var(--a, --b)` - it would be substituted as a literal token instead of the
 * referenced value.
 */
function checkRawFallback( context, rawNode ) {
	const text = String( rawNode.value ).trim();

	if ( LONE_CUSTOM_PROPERTY_PATTERN.test( text ) ) {
		context.report( {
			node: rawNode,
			messageId: 'missingVarFunction',
			data: { name: text }
		} );
	}
}
