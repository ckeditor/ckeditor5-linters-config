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
			globalQuerySelector: 'Do not query `{{ path }}(...)` against the global `document`, query the editor\'s ' +
				'own root instead — it finds nothing inside a shadow root.',
			composedPath: 'Do not use `composedPath()` for root discovery, keep a held reference or use `getRootNode()`.',
			globalDocumentListener: 'Do not attach a global `{{ event }}` listener on `document`, use a per-root ' +
				'listener registry — it will not fire for events inside other shadow roots.',
			bodyAppendChild: 'Do not append directly to `document.body`, use the shadow-aware body-collection root.'
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
			checkCallGlobalQuerySelector,
			checkCallComposedPath,
			checkCallGlobalDocumentListener,
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
 * Flags reading `document.activeElement` or `*.ownerDocument.activeElement`, which is not tracked
 * across Shadow DOM boundaries.
 *
 * document.activeElement; // not allowed, use getActiveElement()
 */
function checkMemberActiveElement( { node, context } ) {
	if ( node.property.name !== 'activeElement' ) {
		return;
	}

	const objectPath = getAccessPath( { node: node.object } );

	if ( !/(^document$|\.ownerDocument$)/.test( objectPath ) ) {
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
 * Flags calls to `getSelection()` in any global or cross-root form.
 *
 * window.getSelection(); // not allowed
 */
function checkCallGetSelection( { node, context, path } ) {
	const isBareCall = path === 'getSelection';
	const isGlobalCall = /^(window|document|global)\.getSelection$/.test( path );
	const isCrossRootCall = /\.(ownerDocument|defaultView)\.getSelection$/.test( path );

	if ( !isBareCall && !isGlobalCall && !isCrossRootCall ) {
		return;
	}

	context.report( {
		node,
		messageId: 'getSelection',
		data: { path }
	} );
}

/**
 * Flags `.contains(...)` called on `document.body` or `*.ownerDocument`, which does not cross
 * Shadow DOM boundaries.
 *
 * document.body.contains( el ); // not allowed, use isConnected()
 */
function checkCallContains( { node, context, path } ) {
	if ( !/\.(body|ownerDocument)\.contains$/.test( path ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'contains',
		data: { path }
	} );
}

/**
 * Flags `document.elementFromPoint(...)` / `document.elementsFromPoint(...)`, which ignore Shadow DOM.
 *
 * document.elementFromPoint( x, y ); // not allowed
 */
function checkCallElementFromPoint( { node, context, path } ) {
	if ( !/^document\.(elementFromPoint|elementsFromPoint)$/.test( path ) ) {
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
 * Flags `document.querySelector(...)` / `querySelectorAll(...)` / `getElementById(...)` called
 * against the global `document`, which finds nothing inside a shadow root.
 *
 * document.querySelector( '.foo' ); // not allowed
 */
function checkCallGlobalQuerySelector( { node, context, path } ) {
	if ( !/^document\.(querySelector|querySelectorAll|getElementById)$/.test( path ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'globalQuerySelector',
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
 * Flags global `mouseenter` / `mouseleave` / `scroll` listeners attached to `document`, which will
 * not fire for events inside other shadow roots.
 *
 * document.addEventListener( 'scroll', listener ); // not allowed
 */
function checkCallGlobalDocumentListener( { node, context, path } ) {
	if ( !/^(global\.document|document)\.(addEventListener|removeEventListener)$/.test( path ) ) {
		return;
	}

	const eventArg = node.arguments[ 0 ];
	const eventName = eventArg && eventArg.type === 'Literal' ? eventArg.value : null;

	if ( ![ 'mouseenter', 'mouseleave', 'scroll' ].includes( eventName ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'globalDocumentListener',
		data: { event: eventName }
	} );
}

/**
 * Flags appending directly to `document.body`.
 *
 * document.body.appendChild( el ); // not allowed
 */
function checkCallBodyAppendChild( { node, context, path } ) {
	if ( path !== 'document.body.appendChild' ) {
		return;
	}

	context.report( {
		node,
		messageId: 'bodyAppendChild'
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
