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
	'anchor-scope',
	'position-anchor',
	'position-try',
	'position-try-fallbacks',
	'font-palette',
	'scroll-timeline',
	'scroll-timeline-name',
	'view-timeline',
	'view-timeline-name',
	'timeline-scope',
	'animation-timeline',
	'view-transition-name',
	'view-transition-class',
	'view-transition-group'
] );

// Functions whose dashed-ident arguments are names, not custom property references.
const FUNCTIONS_WITH_DASHED_IDENTS = new Set( [ 'var', 'anchor', 'anchor-size' ] );

// At-rules whose blocks contain descriptors - `var()` does not work in descriptors, so dashed
// identifiers there (for example `types: --forward` in `@view-transition`) are names.
const DESCRIPTOR_AT_RULES = new Set( [ 'font-face', 'font-palette-values', 'counter-style', 'property', 'view-transition' ] );

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
		let descriptorDepth = 0;

		return {
			Atrule( node ) {
				if ( DESCRIPTOR_AT_RULES.has( String( node.name ).toLowerCase() ) ) {
					descriptorDepth++;
				}
			},

			'Atrule:exit'( node ) {
				if ( DESCRIPTOR_AT_RULES.has( String( node.name ).toLowerCase() ) ) {
					descriptorDepth--;
				}
			},

			Declaration( node ) {
				if ( descriptorDepth > 0 || typeof node.property !== 'string' || !node.value ) {
					return;
				}

				if ( PROPERTIES_WITH_DASHED_IDENTS.has( node.property.toLowerCase() ) ) {
					return;
				}

				const isCustomProperty = node.property.startsWith( '--' );

				// Custom-property values are exposed as an opaque Raw token.
				if ( node.value.type === 'Raw' ) {
					checkRawText( { context, rawNode: node.value, isCustomProperty } );

					return;
				}

				walkValue( { context, valueNode: node.value, isCustomProperty } );
			}
		};
	}
};

/**
 * Reports bare custom-property references in a (sub)value. In native properties every bare
 * reference is a mistake. In custom-property token streams a bare identifier may be
 * intentional data, so only a value that is exactly one lone reference is flagged - at every
 * nesting level. `var()` fallbacks are exposed as Raw tokens and are re-parsed recursively.
 */
function walkValue( { context, valueNode, isCustomProperty, anchorNode } ) {
	cssTree.walk( valueNode, function( child ) {
		if ( child.type === 'Raw' ) {
			checkRawText( { context, rawNode: anchorNode || child, isCustomProperty, text: child.value } );

			return;
		}

		if ( isCustomProperty || child.type !== 'Identifier' || !String( child.name ).startsWith( '--' ) ) {
			return;
		}

		// The first argument of `var()` is the reference itself; `anchor()` and `anchor-size()`
		// take anchor names.
		if ( this.function && FUNCTIONS_WITH_DASHED_IDENTS.has( String( this.function.name ).toLowerCase() ) ) {
			return;
		}

		context.report( {
			// Nodes of a re-parsed fragment have no location - report on the enclosing token.
			node: anchorNode || child,
			messageId: 'missingVarFunction',
			data: { name: child.name }
		} );
	} );
}

function checkRawText( { context, rawNode, isCustomProperty, text = rawNode.value } ) {
	let ast;

	try {
		ast = cssTree.parse( String( text ), { context: 'value' } );
	} catch {
		return;
	}

	const children = [ ...ast.children ];

	// A value that is exactly one lone bare reference is a mistake in every context, including
	// custom property token streams (`--x: --y`). Parsing handles comments and Unicode names.
	if ( children.length === 1 && children[ 0 ].type === 'Identifier' && String( children[ 0 ].name ).startsWith( '--' ) ) {
		context.report( {
			node: rawNode,
			messageId: 'missingVarFunction',
			data: { name: children[ 0 ].name }
		} );

		return;
	}

	walkValue( { context, valueNode: ast, isCustomProperty, anchorNode: rawNode } );
}
