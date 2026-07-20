/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow the use of utilities that cannot be used within the Shadow DOM',
			category: 'CKEditor5'
		},
		messages: {
			activeElement: 'Do not read `{{ path }}.activeElement` directly, use `getActiveElement()` — ' +
				'it is not tracked across Shadow DOM boundaries.',
			shadowRootDiscovery: 'Do not use `.shadowRoot` for root discovery at read time. ' +
				'Keep a held reference or use `getRootNode()`.',
			parentTraversal: 'Do not traverse `.{{ property }}` directly, use `getParentOrHostElement()` ' +
				'to cross Shadow DOM boundaries correctly.',
			getSelection: 'Do not call `{{ path }}(...)` directly, use `getSelection()` from the Shadow DOM utils.',
			contains: 'Do not use `{{ path }}(...)`, use `isConnected()` instead — ' +
				'`contains()` does not cross Shadow DOM boundaries.',
			elementFromPoint: 'Do not use `{{ path }}(...)` directly, resolve the point via the element\'s own root ' +
				'— `{{ path }}` ignores Shadow DOM.',
			caretFromPoint: 'Call `{{ path }}(...)` with a `{ shadowRoots }` option, ' +
				'otherwise it will not resolve carets inside Shadow DOM.',
			documentQuerySelector: 'Do not query `{{ path }}(...)` against the top-level document, query the ' +
				'editor\'s own root instead — it finds nothing inside a shadow root.',
			composedPath: 'Do not use `composedPath()` for root discovery, keep a held reference or use `getRootNode()`.',
			documentListener: 'Do not attach a `{{ event }}` listener on `{{ path }}`, use a per-root ' +
				'listener registry — it will not fire for events inside other shadow roots.',
			bodyAppendChild: 'Do not append directly to `{{ path }}(...)`, use the shadow-aware body-collection root.'
		}
	},
	create( context ) {
		const memberExpressionChecks = [
			checkMemberActiveElement,
			checkMemberShadowRootDiscovery,
			checkMemberParentTraversal
		];

		const callExpressionChecks = [
			checkCallGetSelection,
			checkCallContains,
			checkCallElementFromPoint,
			checkCallCaretFromPoint,
			checkCallDocumentQuerySelector,
			checkCallComposedPath,
			checkCallDocumentListener,
			checkCallBodyAppendChild
		];

		return {
			MemberExpression( node ) {
				if ( node.computed ) {
					return;
				}

				const args = { node, context };

				for ( const check of memberExpressionChecks ) {
					check( args );
				}
			},
			CallExpression( node ) {
				const args = { node, context, path: getAccessPath( { node: node.callee } ) };

				for ( const check of callExpressionChecks ) {
					check( args );
				}
			}
		};
	}
};

/**
 * Flags reading `document.activeElement`, `global.document.activeElement`, or
 * `*.ownerDocument.activeElement`, which is not tracked across Shadow DOM boundaries.
 *
 * document.activeElement; // not allowed, use getActiveElement()
 */
function checkMemberActiveElement( { node, context } ) {
	if ( node.property.name !== 'activeElement' ) {
		return;
	}

	const objectPath = getAccessPath( { node: node.object } );

	if ( !isDocumentAccessPath( objectPath ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'activeElement',
		data: { path: objectPath }
	} );
}

/**
 * Flags reading `.shadowRoot` for root discovery at read time.
 *
 * el.shadowRoot; // not allowed, use getRootNode()
 */
function checkMemberShadowRootDiscovery( { node, context } ) {
	if ( node.property.name !== 'shadowRoot' ) {
		return;
	}

	context.report( {
		node,
		messageId: 'shadowRootDiscovery'
	} );
}

/**
 * Flags raw `.parentNode` / `.parentElement` traversal, which does not cross Shadow DOM boundaries.
 *
 * el.parentNode; // not allowed, use getParentOrHostElement()
 */
function checkMemberParentTraversal( { node, context } ) {
	const propertyName = node.property.name;

	if ( propertyName !== 'parentNode' && propertyName !== 'parentElement' ) {
		return;
	}

	context.report( {
		node,
		messageId: 'parentTraversal',
		data: { property: propertyName }
	} );
}

/**
 * Flags calls to `getSelection()` in any global or cross-root form. A bare `getSelection()` call is
 * only flagged when it resolves to the global one, not to a locally imported or declared helper.
 *
 * global.window.getSelection(); // not allowed
 */
function checkCallGetSelection( { node, context, path } ) {
	const isGlobalCall = /^(global\.)?(window|document)\.getSelection$/.test( path ) || path === 'global.getSelection';
	const isCrossRootCall = /\.(ownerDocument|defaultView)\.getSelection$/.test( path );
	const isBareGlobalCall = path === 'getSelection' && !isLocallyDefinedReference( { node: node.callee, context } );

	if ( !isBareGlobalCall && !isGlobalCall && !isCrossRootCall ) {
		return;
	}

	context.report( {
		node,
		messageId: 'getSelection',
		data: { path }
	} );
}

/**
 * Flags `.contains(...)` called directly on the top-level document (`document`, `global.document`,
 * or `*.ownerDocument`) or on its body (`document.body`, `global.document.body`, or
 * `*.ownerDocument.body`), which does not cross Shadow DOM boundaries. A `.body.contains(...)` call
 * on a non-document object is not restricted here, since `body` is a common, unrelated property name.
 *
 * document.contains( el ); // not allowed, use isConnected()
 */
function checkCallContains( { node, context, path } ) {
	const match = path.match( /^(.+)\.contains$/ );

	if ( !match ) {
		return;
	}

	const bodyMatch = match[ 1 ].match( /^(.+)\.body$/ );
	const isDocumentContains = isDocumentAccessPath( match[ 1 ] );
	const isDocumentBodyContains = Boolean( bodyMatch ) && isDocumentAccessPath( bodyMatch[ 1 ] );

	if ( !isDocumentContains && !isDocumentBodyContains ) {
		return;
	}

	context.report( {
		node,
		messageId: 'contains',
		data: { path }
	} );
}

/**
 * Flags `document.elementFromPoint(...)` / `elementsFromPoint(...)` called on the top-level document
 * (`document`, `global.document`, or `*.ownerDocument`), which ignores Shadow DOM.
 *
 * document.elementFromPoint( x, y ); // not allowed
 */
function checkCallElementFromPoint( { node, context, path } ) {
	const match = path.match( /^(.+)\.(elementFromPoint|elementsFromPoint)$/ );

	if ( !match || !isDocumentAccessPath( match[ 1 ] ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'elementFromPoint',
		data: { path }
	} );
}

/**
 * Flags `caretRangeFromPoint(...)` / `caretPositionFromPoint(...)` calls missing a `{ shadowRoots }`
 * option, without which they will not resolve carets inside Shadow DOM.
 *
 * document.caretRangeFromPoint( x, y ); // not allowed, missing { shadowRoots }
 */
function checkCallCaretFromPoint( { node, context, path } ) {
	const isTargetCall = /(^|\.)(caretRangeFromPoint|caretPositionFromPoint)$/.test( path );

	if ( !isTargetCall || hasShadowRootsOption( { args: node.arguments } ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'caretFromPoint',
		data: { path }
	} );

	function hasShadowRootsOption( { args } ) {
		const lastArg = args[ args.length - 1 ];

		return Boolean(
			lastArg &&
			lastArg.type === 'ObjectExpression' &&
			lastArg.properties.some( property =>
				property.key && ( property.key.name === 'shadowRoots' || property.key.value === 'shadowRoots' )
			)
		);
	}
}

/**
 * Flags `querySelector(...)` / `querySelectorAll(...)` / `getElementById(...)` called on the
 * top-level document (`document`, `global.document`, or `*.ownerDocument`), which finds nothing
 * inside a shadow root.
 *
 * document.querySelector( '.foo' ); // not allowed
 */
function checkCallDocumentQuerySelector( { node, context, path } ) {
	const match = path.match( /^(.+)\.(querySelector|querySelectorAll|getElementById)$/ );

	if ( !match || !isDocumentAccessPath( match[ 1 ] ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'documentQuerySelector',
		data: { path }
	} );
}

/**
 * Flags `composedPath()` used for root discovery.
 *
 * event.composedPath()[ 0 ]; // not allowed, use getRootNode()
 */
function checkCallComposedPath( { node, context, path } ) {
	if ( !/(^|\.)composedPath$/.test( path ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'composedPath'
	} );
}

/**
 * Flags `mouseenter` / `mouseleave` / `scroll` listeners attached to the top-level document
 * (`document`, `global.document`, or `*.ownerDocument`), which will not fire for events inside
 * other shadow roots.
 *
 * document.addEventListener( 'scroll', listener ); // not allowed
 */
function checkCallDocumentListener( { node, context, path } ) {
	const match = path.match( /^(.+)\.(addEventListener|removeEventListener)$/ );

	if ( !match || !isDocumentAccessPath( match[ 1 ] ) ) {
		return;
	}

	const eventArg = node.arguments[ 0 ];
	const eventName = eventArg && eventArg.type === 'Literal' ? eventArg.value : null;

	if ( ![ 'mouseenter', 'mouseleave', 'scroll' ].includes( eventName ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'documentListener',
		data: { event: eventName, path }
	} );
}

/**
 * Flags appending directly to the top-level document body (`document.body`, `global.document.body`,
 * or `*.ownerDocument.body`).
 *
 * document.body.appendChild( el ); // not allowed
 */
function checkCallBodyAppendChild( { node, context, path } ) {
	const match = path.match( /^(.+)\.body\.appendChild$/ );

	if ( !match || !isDocumentAccessPath( match[ 1 ] ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'bodyAppendChild',
		data: { path }
	} );
}

/**
 * Builds a dotted string representation of a member/call path, collapsing computed and other
 * non-trivial segments to `*` so checks can rely on plain regexes.
 *
 * el.ownerDocument.defaultView.getSelection() -> 'el.ownerDocument.defaultView.getSelection()'
 */
function getAccessPath( { node } ) {
	if ( !node ) {
		return '';
	}

	if ( node.type === 'Identifier' ) {
		return node.name;
	}

	if ( node.type === 'ThisExpression' ) {
		return 'this';
	}

	if ( node.type === 'MemberExpression' ) {
		const propertyName = node.computed ? '*' : node.property.name;

		return `${ getAccessPath( { node: node.object } ) }.${ propertyName }`;
	}

	if ( node.type === 'CallExpression' ) {
		return `${ getAccessPath( { node: node.callee } ) }()`;
	}

	return '*';
}

/**
 * Checks whether a path refers to the top-level document: `document`, `global.document`, or any
 * `*.ownerDocument` access.
 *
 * isDocumentAccessPath( 'global.document' ); // -> true
 */
function isDocumentAccessPath( path ) {
	return /^(global\.)?document$/.test( path ) || /\.ownerDocument$/.test( path );
}

/**
 * Checks whether an identifier reference resolves to a variable declared or imported in the source
 * (as opposed to an unresolved, implicitly global one).
 *
 * import { getSelection } from './shadow-dom-utils.js'; // -> resolves locally, not global
 */
function isLocallyDefinedReference( { node, context } ) {
	const sourceCode = context.sourceCode || context.getSourceCode();

	let scope = sourceCode.getScope ? sourceCode.getScope( node ) : context.getScope();

	while ( scope ) {
		const reference = scope.references.find( ref => ref.identifier === node );

		if ( reference ) {
			return Boolean( reference.resolved && reference.resolved.defs.length > 0 );
		}

		scope = scope.upper;
	}

	return false;
}
