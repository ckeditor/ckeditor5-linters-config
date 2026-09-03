/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const cssTree = require( '@eslint/css-tree' );
const { toUnix } = require( 'upath' );

const INDEX_CONTENT_FILE_PATTERN = /(^|\/)theme\/index-content\.css$/;
const KEYFRAMES_AT_RULE_PATTERN = /^(?:-[a-z]+-)?keyframes$/i;

function isIndexContentFile( filename ) {
	return INDEX_CONTENT_FILE_PATTERN.test( toUnix( filename ) );
}

/**
 * Creates CSS AST listeners which resolve nested selectors and call `validateSelector`
 * once for every selector in a rule's selector list.
 */
function createSelectorVisitors( validateSelector ) {
	const atRuleStack = [];
	const effectiveSelectorStack = [];

	return {
		Atrule( node ) {
			atRuleStack.push( node.name || '' );
		},

		'Atrule:exit'() {
			atRuleStack.pop();
		},

		Rule( node ) {
			if ( atRuleStack.some( name => KEYFRAMES_AT_RULE_PATTERN.test( name ) ) || node.prelude.type !== 'SelectorList' ) {
				effectiveSelectorStack.push( [] );

				return;
			}

			const parentSelectors = effectiveSelectorStack.at( -1 ) || [];
			const allEffectiveSelectors = [];

			for ( const selector of node.prelude.children ) {
				const effectiveSelectors = resolveEffectiveSelectors( selector, parentSelectors );

				allEffectiveSelectors.push( ...effectiveSelectors );
				validateSelector( selector, classifyEffectiveSelectors( effectiveSelectors, hasOnlyResourceDeclarations( node ) ) );
			}

			effectiveSelectorStack.push( allEffectiveSelectors );
		},

		'Rule:exit'() {
			effectiveSelectorStack.pop();
		}
	};
}

function resolveEffectiveSelectors( selector, parentSelectors ) {
	const selectorText = cssTree.generate( selector );
	const hasNestingSelector = containsNestingSelector( selector );

	if ( parentSelectors.length === 0 ) {
		return [ selectorText ];
	}

	return parentSelectors.map( parentSelector => {
		if ( hasNestingSelector ) {
			return selectorText.replaceAll( '&', parentSelector );
		}

		return `${ parentSelector } ${ selectorText }`;
	} );
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

function classifyEffectiveSelectors( selectors, allowRootResourceSelector ) {
	const kinds = new Set();

	for ( const selectorText of selectors ) {
		let selector;

		try {
			selector = cssTree.parse( selectorText, { context: 'selector' } );
		} catch {
			kinds.add( 'editor' );

			continue;
		}

		if ( allowRootResourceSelector && isRootResourceSelector( selector ) ) {
			kinds.add( 'resource' );

			continue;
		}

		if ( hasEditorDescendant( selector ) ) {
			kinds.add( 'editor' );

			continue;
		}

		for ( const state of rootCompoundStates( selector ) ) {
			if ( state.hasContent && !state.hasEditorScope ) {
				kinds.add( 'content' );
			} else {
				kinds.add( 'editor' );
			}
		}
	}

	return kinds;
}

function rootCompoundStates( selector ) {
	let states = [ { hasContent: false, hasEditorScope: false } ];
	const compounds = [ [] ];

	for ( const node of selector.children ) {
		if ( node.type === 'Combinator' ) {
			compounds.push( [] );

			continue;
		}

		compounds.at( -1 ).push( node );
	}

	const rootCompound = isDirectionScope( compounds[ 0 ] ) && compounds.length > 1 ? compounds[ 1 ] : compounds[ 0 ];

	for ( const node of rootCompound ) {
		if ( node.type === 'ClassSelector' ) {
			states = states.map( state => ( {
				hasContent: state.hasContent || node.name === 'ck-content',
				hasEditorScope: state.hasEditorScope || isEditorScopeClass( node.name )
			} ) );
		} else if ( node.type === 'PseudoClassSelector' && [ 'is', 'where' ].includes( node.name.toLowerCase() ) ) {
			const alternatives = pseudoClassStates( node );

			if ( alternatives.length > 0 ) {
				states = combineStates( states, alternatives );
			}
		}
	}

	return states;
}

function isDirectionScope( compound ) {
	return compound.length > 0 && compound.every( node => {
		return node.type === 'AttributeSelector' && node.name?.name?.toLowerCase() === 'dir';
	} );
}

function isEditorScopeClass( className ) {
	return className !== 'ck-content' && ( className === 'ck' || className.startsWith( 'ck-' ) );
}

function hasEditorDescendant( selector ) {
	let afterCombinator = false;

	for ( const node of selector.children ) {
		if ( node.type === 'Combinator' ) {
			afterCombinator = true;

			continue;
		}

		if ( afterCombinator && hasEditorClass( node ) ) {
			return true;
		}
	}

	return false;
}

function hasEditorClass( node ) {
	if ( node.type === 'ClassSelector' ) {
		return /^ck-editor(?:$|__|_)/.test( node.name );
	}

	// `:not()` excludes the matched elements, so editor classes inside it do not target the editor UI.
	if ( node.type === 'PseudoClassSelector' && node.name.toLowerCase() === 'not' ) {
		return false;
	}

	if ( !node.children ) {
		return false;
	}

	return [ ...node.children ].some( child => hasEditorClass( child ) );
}

function pseudoClassStates( pseudoClass ) {
	if ( !pseudoClass.children ) {
		return [];
	}

	const selectorList = [ ...pseudoClass.children ].find( node => node.type === 'SelectorList' );

	if ( !selectorList ) {
		return [];
	}

	return [ ...selectorList.children ].flatMap( selector => rootCompoundStates( selector ) );
}

function combineStates( states, alternatives ) {
	return states.flatMap( state => alternatives.map( alternative => ( {
		hasContent: state.hasContent || alternative.hasContent,
		hasEditorScope: state.hasEditorScope || alternative.hasEditorScope
	} ) ) );
}

/**
 * Checks whether the selector declares the root scope a stylesheet resolves its custom properties in.
 *
 * Both `:root` and a bare `:host` count: the theme pairs them (`:root,\n:host { … }`) so that a single
 * stylesheet resolves its tokens in the light DOM and inside a shadow root alike, where `:root` matches
 * nothing. A parameterized `:host(…)` targets specific hosts rather than the root scope, so it does not.
 */
function isRootResourceSelector( selector ) {
	const nodes = [ ...selector.children ];

	if ( nodes.length !== 1 || nodes[ 0 ].type !== 'PseudoClassSelector' ) {
		return false;
	}

	const name = nodes[ 0 ].name.toLowerCase();

	return name === 'root' || ( name === 'host' && !nodes[ 0 ].children );
}

function hasOnlyResourceDeclarations( rule ) {
	for ( const node of rule.block.children ) {
		if ( node.type === 'Declaration' && ( typeof node.property !== 'string' || !node.property.startsWith( '--' ) ) ) {
			return false;
		}
	}

	return true;
}

module.exports = {
	createSelectorVisitors,
	isIndexContentFile
};
