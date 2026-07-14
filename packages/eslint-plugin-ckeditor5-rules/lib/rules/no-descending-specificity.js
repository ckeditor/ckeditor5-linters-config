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
		const seenByContext = new Map();
		let keyframesDepth = 0;

		return {
			Atrule( node ) {
				if ( isKeyframes( node ) ) {
					keyframesDepth++;
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

				if ( keyframesDepth === 0 && prelude && prelude.type === 'SelectorList' ) {
					const contextKey = contextStack.join( ' > ' );

					for ( const selector of prelude.children ) {
						checkSelector( context, selector, contextKey, seenByContext );
					}
				}

				contextStack.push( prelude ? cssTree.generate( prelude ) : '' );
			},

			'Rule:exit'() {
				contextStack.pop();
			}
		};
	}
};

function checkSelector( context, selector, contextKey, seenByContext ) {
	const keySelector = keySelectorText( selector );

	if ( keySelector === null ) {
		return;
	}

	const mapKey = `${ contextKey } | ${ keySelector }`;
	const specificity = computeSpecificity( selector );
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

function computeSpecificity( selectorNode ) {
	const specificity = [ 0, 0, 0 ];

	addSpecificity( selectorNode, specificity );

	return specificity;
}

/**
 * `NestingSelector` (&) is deliberately not counted: it contributes the parent selector's
 * specificity, which is identical for all selectors compared within the same context.
 */
function addSpecificity( node, specificity ) {
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
				addPseudoClassSpecificity( child, specificity );
				break;
			case 'PseudoElementSelector':
				specificity[ 2 ]++;
				break;
			case 'TypeSelector':
				if ( child.name !== '*' ) {
					specificity[ 2 ]++;
				}

				break;
		}
	}
}

function addPseudoClassSpecificity( pseudoNode, specificity ) {
	const name = String( pseudoNode.name ).toLowerCase();

	// `:where()` contributes nothing.
	if ( name === 'where' ) {
		return;
	}

	// `:not()`, `:is()`, `:has()` and `:matches()` contribute the specificity of their most
	// specific argument instead of counting as a pseudo-class.
	if ( name === 'not' || name === 'is' || name === 'has' || name === 'matches' ) {
		let best = null;

		cssTree.walk( pseudoNode, innerNode => {
			if ( innerNode.type !== 'Selector' ) {
				return;
			}

			const inner = computeSpecificity( innerNode );

			if ( best === null || compareSpecificity( inner, best ) > 0 ) {
				best = inner;
			}
		} );

		if ( best !== null ) {
			specificity[ 0 ] += best[ 0 ];
			specificity[ 1 ] += best[ 1 ];
			specificity[ 2 ] += best[ 2 ];
		}

		return;
	}

	specificity[ 1 ]++;
}

function compareSpecificity( a, b ) {
	return (
		( a[ 0 ] - b[ 0 ] ) ||
		( a[ 1 ] - b[ 1 ] ) ||
		( a[ 2 ] - b[ 2 ] )
	);
}

function isKeyframes( atruleNode ) {
	return typeof atruleNode.name === 'string' && /^(-\w+-)?keyframes$/i.test( atruleNode.name );
}
