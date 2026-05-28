/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const cssTree = require( '@eslint/css-tree' );

const NAMED_COLORS = new Set(
	cssTree.lexer.types[ 'named-color' ].syntax.terms
		.filter( term => term.type === 'Keyword' )
		.map( term => term.name )
);

const COLOR_ACCEPTING_PROPERTIES = buildColorAcceptingProperties();

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow hex, rgb()/rgba() and named CSS colors in declaration values. Use HSL or CSS custom properties instead.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			disallowedHex: 'Hex colors are not allowed. Use HSL or a CSS custom property instead.',
			disallowedRgb: 'rgb()/rgba() is not allowed. Use HSL or a CSS custom property instead.',
			disallowedNamedColor: 'Named CSS colors are not allowed. Use HSL or a CSS custom property instead.'
		}
	},

	create( context ) {
		return {
			'Rule > Block Declaration Hash'( node ) {
				context.report( {
					node,
					messageId: 'disallowedHex'
				} );
			},

			'Rule > Block Declaration Function'( node ) {
				const name = typeof node.name === 'string' ? node.name.toLowerCase() : '';

				if ( name === 'rgb' || name === 'rgba' ) {
					context.report( {
						node,
						messageId: 'disallowedRgb'
					} );
				}
			},

			'Rule > Block Declaration'( node ) {
				const propertyName = typeof node.property === 'string' ? node.property.toLowerCase() : '';

				if ( !COLOR_ACCEPTING_PROPERTIES.has( propertyName ) ) {
					return;
				}

				cssTree.walk( node.value, sub => {
					if ( sub.type !== 'Identifier' ) {
						return;
					}

					if ( sub.name.startsWith( '--' ) ) {
						return;
					}

					if ( NAMED_COLORS.has( sub.name.toLowerCase() ) ) {
						context.report( {
							node: sub,
							messageId: 'disallowedNamedColor'
						} );
					}
				} );
			}
		};
	}
};

/**
 * Property names whose CSS grammar references `<color>` somewhere - the properties for
 * which an identifier value (e.g. `red`) could legitimately be a color.
 */
function buildColorAcceptingProperties() {
	const result = new Set();

	for ( const propertyName of Object.keys( cssTree.lexer.properties ) ) {
		if ( propertyAcceptsColor( propertyName ) ) {
			result.add( propertyName );
		}
	}

	return result;
}

function propertyAcceptsColor( propertyName ) {
	const definition = cssTree.lexer.properties[ propertyName ];

	if ( !definition || !definition.syntax ) {
		return false;
	}

	return syntaxReferencesColor( definition.syntax, new Set( [ `P:${ propertyName }` ] ) );
}

/**
 * Whether a CSS syntax tree (transitively, through type and property references) reaches the `<color>` type.
 */
function syntaxReferencesColor( syntax, visited ) {
	let found = false;

	cssTree.definitionSyntax.walk( syntax, node => {
		if ( found ) {
			return;
		}

		if ( node.type === 'Type' ) {
			if ( node.name === 'color' ) {
				found = true;

				return;
			}

			const key = `T:${ node.name }`;

			if ( visited.has( key ) ) {
				return;
			}

			visited.add( key );

			const typeDefinition = cssTree.lexer.types[ node.name ];

			if ( typeDefinition && typeDefinition.syntax && syntaxReferencesColor( typeDefinition.syntax, visited ) ) {
				found = true;
			}
		} else if ( node.type === 'Property' ) {
			const key = `P:${ node.name }`;

			if ( visited.has( key ) ) {
				return;
			}

			visited.add( key );

			const propertyDefinition = cssTree.lexer.properties[ node.name ];

			if ( propertyDefinition && propertyDefinition.syntax && syntaxReferencesColor( propertyDefinition.syntax, visited ) ) {
				found = true;
			}
		}
	} );

	return found;
}
