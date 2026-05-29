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
				// `@eslint/css` exposes custom-property values (`--foo: ...`) as a Raw
				// token, so the AST visitors above don't see what's inside; re-parse
				// the raw text via css-tree to recover the value AST.
				if ( node.value && node.value.type === 'Raw' ) {
					checkRawValue( context, node.value );

					return;
				}

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

function checkRawValue( context, rawNode ) {
	const text = typeof rawNode.value === 'string' ? rawNode.value : '';

	if ( !text.trim() ) {
		return;
	}

	let ast;

	try {
		ast = cssTree.parse( text, { context: 'value', positions: true } );
	} catch {
		return;
	}

	cssTree.walk( ast, sub => {
		if ( sub.type === 'Hash' ) {
			reportInRaw( context, rawNode, sub, 'disallowedHex' );
		} else if ( sub.type === 'Function' ) {
			const fnName = typeof sub.name === 'string' ? sub.name.toLowerCase() : '';

			if ( fnName === 'rgb' || fnName === 'rgba' ) {
				reportInRaw( context, rawNode, sub, 'disallowedRgb' );
			}
		} else if ( sub.type === 'Identifier' ) {
			const idName = typeof sub.name === 'string' ? sub.name.toLowerCase() : '';

			if ( !idName.startsWith( '--' ) && NAMED_COLORS.has( idName ) ) {
				reportInRaw( context, rawNode, sub, 'disallowedNamedColor' );
			}
		}
	} );
}

function reportInRaw( context, rawNode, subNode, messageId ) {
	if ( !subNode.loc ) {
		context.report( { node: rawNode, messageId } );

		return;
	}

	context.report( {
		loc: {
			start: translatePosition( subNode.loc.start, rawNode.loc.start ),
			end: translatePosition( subNode.loc.end, rawNode.loc.start )
		},
		messageId
	} );
}

// Line 1 of the sub-parsed value starts mid-file at `rawStart.column`; later lines
// start at file column 1, so only line 1 needs the column anchor shift.
function translatePosition( pos, rawStart ) {
	if ( pos.line === 1 ) {
		return { line: rawStart.line, column: rawStart.column + pos.column - 1 };
	}

	return { line: rawStart.line + pos.line - 1, column: pos.column };
}

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
