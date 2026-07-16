/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const cssTree = require( '@eslint/css-tree' );

/**
 * Local implementation of stylelint's `no-descending-specificity`:
 * https://stylelint.io/user-guide/rules/no-descending-specificity/
 *
 * Unlike the original, selectors are compared only within the same context (the same nesting
 * parent and at-rule conditions) - nested selectors are not resolved and compared across contexts.
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow selectors of lower specificity after overriding selectors of higher specificity targeting the same element.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			descendingSpecificity:
				'Selector \'{{ selector }}\' ({{ specificity }}) comes after the more specific ' +
				'\'{{ higherSelector }}\' ({{ higherSpecificity }}) targeting the same element.'
		}
	},

	create( context ) {
		const contextStack = [];
		const parentSpecificityStack = [];
		const seenByContext = new Map();
		let keyframesDepth = 0;
		let anonymousLayerCount = 0;

		return {
			Atrule( node ) {
				if ( isKeyframes( node ) ) {
					keyframesDepth++;
				}

				// Every anonymous `@layer` is a distinct cascade layer, so it needs an identity
				// instead of the (identical) generated text.
				if ( String( node.name ).toLowerCase() === 'layer' && !node.prelude ) {
					contextStack.push( `@layer #${ ++anonymousLayerCount }` );

					return;
				}

				contextStack.push( `@${ node.name } ${ node.prelude ? cssTree.generate( node.prelude ) : '' }` );
			},

			'Atrule:exit'( node ) {
				if ( isKeyframes( node ) ) {
					keyframesDepth--;
				}

				contextStack.pop();
			},

			Rule( node ) {
				const prelude = node.prelude;
				const isNested = parentSpecificityStack.length > 0;
				const parentSpecificity = parentSpecificityStack.at( -1 ) || [ 0, 0, 0 ];

				// Rules without own declarations (empty rules, pure nesting containers) do not
				// style the compared element and are not compared, like in stylelint.
				const hasDeclarations = !!node.block &&
					[ ...node.block.children ].some( child => child.type === 'Declaration' );

				let resolvedSpecificity = [ 0, 0, 0 ];

				if ( prelude && prelude.type === 'SelectorList' ) {
					const contextKey = contextStack.join( ' > ' );

					for ( const selector of prelude.children ) {
						const specificity = computeSpecificity( selector, parentSpecificity );

						// A nested selector without `&` is implicitly prefixed with `& `, so it
						// inherits the parent specificity just like an explicit `&` would.
						if ( isNested && !containsNestingSelector( selector ) ) {
							specificity[ 0 ] += parentSpecificity[ 0 ];
							specificity[ 1 ] += parentSpecificity[ 1 ];
							specificity[ 2 ] += parentSpecificity[ 2 ];
						}

						if ( keyframesDepth === 0 && hasDeclarations ) {
							checkSelector( { context, selector, specificity, contextKey, seenByContext } );
						}

						if ( compareSpecificity( specificity, resolvedSpecificity ) > 0 ) {
							resolvedSpecificity = specificity;
						}
					}
				}

				contextStack.push( prelude ? cssTree.generate( prelude ) : '' );
				parentSpecificityStack.push( resolvedSpecificity );
			},

			'Rule:exit'() {
				contextStack.pop();
				parentSpecificityStack.pop();
			}
		};
	}
};

function checkSelector( { context, selector, specificity, contextKey, seenByContext } ) {
	const keySelector = keySelectorText( selector );

	if ( keySelector === null ) {
		return;
	}

	const mapKey = `${ contextKey } | ${ keySelector }`;
	const selectorText = cssTree.generate( selector );

	if ( !seenByContext.has( mapKey ) ) {
		seenByContext.set( mapKey, [] );
	}

	const earlierEntries = seenByContext.get( mapKey );
	const higher = earlierEntries.find( entry => compareSpecificity( entry.specificity, specificity ) > 0 );

	if ( higher ) {
		context.report( {
			node: selector.loc ? selector : undefined,
			messageId: 'descendingSpecificity',
			data: {
				selector: selectorText,
				specificity: specificity.join( ',' ),
				higherSelector: higher.selectorText,
				higherSpecificity: higher.specificity.join( ',' )
			}
		} );
	}

	earlierEntries.push( { specificity, selectorText } );
}

/**
 * The "key selector" is the last compound selector - the part that names the element the
 * selector actually targets. Pseudo-classes are dropped from the key (`a:hover` targets the
 * same element as `a`), pseudo-elements are kept (`a::before` targets a different box).
 */
function keySelectorText( selector ) {
	if ( !selector.children ) {
		return null;
	}

	let compound = [];

	for ( const child of selector.children ) {
		if ( child.type === 'Combinator' ) {
			compound = [];
		} else {
			compound.push( child );
		}
	}

	const parts = compound
		.filter( node => node.type !== 'PseudoClassSelector' )
		.map( node => cssTree.generate( node ) );

	if ( parts.length === 0 ) {
		return null;
	}

	return parts.join( '' );
}

function computeSpecificity( selectorNode, parentSpecificity ) {
	const specificity = [ 0, 0, 0 ];

	addSpecificity( { node: selectorNode, specificity, parentSpecificity } );

	return specificity;
}

/**
 * `NestingSelector` (&) counts as the parent rule's resolved specificity - per the spec it
 * behaves like `:is()` of the parent selector list.
 */
function addSpecificity( { node, specificity, parentSpecificity } ) {
	if ( !node || !node.children ) {
		return;
	}

	for ( const child of node.children ) {
		switch ( child.type ) {
			case 'IdSelector':
				specificity[ 0 ]++;
				break;
			case 'ClassSelector':
			case 'AttributeSelector':
				specificity[ 1 ]++;
				break;
			case 'PseudoClassSelector':
				addPseudoClassSpecificity( { pseudoNode: child, specificity, parentSpecificity } );
				break;
			case 'PseudoElementSelector':
				specificity[ 2 ]++;

				// `::slotted()` additionally contributes its argument's specificity.
				addBestArgumentSpecificity( { argumentsNode: child, specificity, parentSpecificity } );
				break;
			case 'TypeSelector':
				if ( child.name !== '*' ) {
					specificity[ 2 ]++;
				}

				break;
			case 'NestingSelector':
				specificity[ 0 ] += parentSpecificity[ 0 ];
				specificity[ 1 ] += parentSpecificity[ 1 ];
				specificity[ 2 ] += parentSpecificity[ 2 ];
				break;
		}
	}
}

function addPseudoClassSpecificity( { pseudoNode, specificity, parentSpecificity } ) {
	const name = String( pseudoNode.name ).toLowerCase();

	// `:where()` contributes nothing.
	if ( name === 'where' ) {
		return;
	}

	// `:not()`, `:is()`, `:has()` and `:matches()` contribute the specificity of their most
	// specific argument instead of counting as a pseudo-class. Only the direct argument list is
	// considered - selectors inside a nested `:where()` must not become candidates themselves.
	if ( name === 'not' || name === 'is' || name === 'has' || name === 'matches' ) {
		for ( const argument of pseudoNode.children || [] ) {
			if ( argument.type === 'SelectorList' ) {
				addBestArgumentSpecificity( { argumentsNode: argument, specificity, parentSpecificity } );
			}
		}

		return;
	}

	specificity[ 1 ]++;

	// `:nth-child(An+B of S)` and `:nth-last-child(An+B of S)` additionally contribute the
	// specificity of their most specific `S` argument.
	if ( name === 'nth-child' || name === 'nth-last-child' ) {
		for ( const child of pseudoNode.children || [] ) {
			if ( child.type === 'Nth' && child.selector ) {
				addBestArgumentSpecificity( { argumentsNode: child.selector, specificity, parentSpecificity } );
			}
		}
	}

	// `:host()` and `:host-context()` additionally contribute their argument's specificity.
	if ( name === 'host' || name === 'host-context' ) {
		addBestArgumentSpecificity( { argumentsNode: pseudoNode, specificity, parentSpecificity } );
	}
}

/**
 * Adds the specificity of the most specific `Selector` child of `argumentsNode` - a
 * `SelectorList` or a pseudo whose arguments are direct `Selector` children.
 */
function addBestArgumentSpecificity( { argumentsNode, specificity, parentSpecificity } ) {
	let best = null;

	for ( const innerSelector of argumentsNode.children || [] ) {
		if ( innerSelector.type !== 'Selector' ) {
			continue;
		}

		const inner = computeSpecificity( innerSelector, parentSpecificity );

		if ( best === null || compareSpecificity( inner, best ) > 0 ) {
			best = inner;
		}
	}

	if ( best !== null ) {
		specificity[ 0 ] += best[ 0 ];
		specificity[ 1 ] += best[ 1 ];
		specificity[ 2 ] += best[ 2 ];
	}
}

function compareSpecificity( a, b ) {
	return (
		( a[ 0 ] - b[ 0 ] ) ||
		( a[ 1 ] - b[ 1 ] ) ||
		( a[ 2 ] - b[ 2 ] )
	);
}

function containsNestingSelector( selector ) {
	let found = false;

	cssTree.walk( selector, node => {
		if ( node.type === 'NestingSelector' ) {
			found = true;
		}
	} );

	return found;
}

function isKeyframes( atruleNode ) {
	return typeof atruleNode.name === 'string' && /^(-\w+-)?keyframes$/i.test( atruleNode.name );
}
