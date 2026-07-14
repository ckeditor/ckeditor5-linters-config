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

		// The first argument of `var()` is the reference itself.
		if ( this.function && String( this.function.name ).toLowerCase() === 'var' ) {
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
	const trimmed = String( text ).trim();

	if ( LONE_CUSTOM_PROPERTY_PATTERN.test( trimmed ) ) {
		context.report( {
			node: rawNode,
			messageId: 'missingVarFunction',
			data: { name: trimmed }
		} );

		return;
	}

	let ast;

	try {
		ast = cssTree.parse( text, { context: 'value' } );
	} catch {
		return;
	}

	walkValue( { context, valueNode: ast, isCustomProperty, anchorNode: rawNode } );
}
