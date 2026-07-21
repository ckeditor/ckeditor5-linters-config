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
			caretRangeFromPointUnsupported: 'Native `{{ path }}(...)` does not accept a `{ shadowRoots }` option and ' +
				'always ignores Shadow DOM, regardless of any argument passed. Use `caretPositionFromPoint()` from ' +
				'the Shadow DOM utils instead.',
			documentQuerySelector: 'Do not query `{{ path }}(...)` against the top-level document, query the ' +
				'editor\'s own root instead — it finds nothing inside a shadow root.',
			composedPath: 'Do not use `composedPath()` for root discovery, keep a held reference or use `getRootNode()`.',
			documentListener: 'Do not attach a `{{ event }}` listener on `{{ path }}`, use a per-root ' +
				'listener registry — it will not fire for events inside other shadow roots.',
			bodyAppendChild: 'Do not append directly to `{{ path }}`, use the shadow-aware body-collection root.'
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
 * window.document.getSelection(); // not allowed
 */
function checkCallGetSelection( { node, context, path } ) {
	const match = path.match( /^(.+)\.getSelection$/ );
	const isPrefixedCall = Boolean( match ) &&
		( match[ 1 ] === 'global' || isWindowAccessPath( match[ 1 ] ) || isDocumentAccessPath( match[ 1 ] ) );
	const isBareGlobalCall = path === 'getSelection' &&
		!isLocallyDefinedReference( { node: unwrapExpression( node.callee ), context } );

	if ( !isBareGlobalCall && !isPrefixedCall ) {
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
 * Flags `caretRangeFromPoint(...)` / `caretPositionFromPoint(...)` calls that cannot resolve carets
 * inside Shadow DOM. Native `Document.caretRangeFromPoint(...)` only accepts coordinates and silently
 * ignores any extra argument, so it is unsafe on a document access path no matter what is passed;
 * `caretPositionFromPoint(...)` and a bare, non-member call are only unsafe when missing a
 * `{ shadowRoots }` option.
 *
 * document.caretRangeFromPoint( x, y, { shadowRoots } ); // not allowed, the option is a no-op here
 */
function checkCallCaretFromPoint( { node, context, path } ) {
	const match = path.match( /^(?:(.+)\.)?(caretRangeFromPoint|caretPositionFromPoint)$/ );

	if ( !match ) {
		return;
	}

	const [ , prefix, methodName ] = match;
	const isUnsupportedNativeCall = methodName === 'caretRangeFromPoint' && Boolean( prefix ) && isDocumentAccessPath( prefix );

	if ( isUnsupportedNativeCall ) {
		context.report( {
			node,
			messageId: 'caretRangeFromPointUnsupported',
			data: { path }
		} );

		return;
	}

	if ( hasShadowRootsOption( { args: node.arguments } ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'caretFromPoint',
		data: { path }
	} );

	function hasShadowRootsOption( { args } ) {
		const lastArg = unwrapExpression( args[ args.length - 1 ] );

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

	const eventArg = unwrapExpression( node.arguments[ 0 ] );
	const eventName = eventArg && eventArg.type === 'Literal' ? eventArg.value : null;

	if ( ![ 'mouseenter', 'mouseleave', 'scroll' ].includes( eventName ) ) {
		return;
	}

	context.report( {
		node,
		messageId: 'documentListener',
		data: { event: eventName, path: match[ 1 ] }
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
		data: { path: `${ match[ 1 ] }.body` }
	} );
}

/**
 * Builds a dotted string representation of a member/call path, collapsing computed and other
 * non-trivial segments to `*` so checks can rely on plain regexes. TypeScript wrapper nodes and
 * parenthesized optional chains are unwrapped first, so a cast or a `(x?.y)` grouping doesn't hide
 * the underlying access path.
 *
 * el.ownerDocument.defaultView.getSelection() -> 'el.ownerDocument.defaultView.getSelection()'
 */
function getAccessPath( { node } ) {
	if ( !node ) {
		return '';
	}

	const unwrapped = unwrapExpression( node );

	if ( unwrapped.type === 'Identifier' ) {
		return unwrapped.name;
	}

	if ( unwrapped.type === 'ThisExpression' ) {
		return 'this';
	}

	if ( unwrapped.type === 'MemberExpression' ) {
		const propertyName = unwrapped.computed ? '*' : unwrapped.property.name;

		return `${ getAccessPath( { node: unwrapped.object } ) }.${ propertyName }`;
	}

	if ( unwrapped.type === 'CallExpression' ) {
		return `${ getAccessPath( { node: unwrapped.callee } ) }()`;
	}

	return '*';
}

/**
 * Checks whether a node is a TypeScript-only wrapper expression around another expression.
 *
 * isTypeScriptWrapperExpression( node ); // node for `document!` -> true
 */
function isTypeScriptWrapperExpression( node ) {
	return [ 'TSAsExpression', 'TSNonNullExpression', 'TSTypeAssertion', 'TSSatisfiesExpression' ].includes( node.type );
}

/**
 * Strips TypeScript wrapper nodes (`x as Document`, `x!`, `<Document>x`, `x satisfies Document`) and
 * `ChainExpression` wrappers (parenthesized optional chains, e.g. `(x?.y)`) down to the expression
 * underneath, since neither changes what is actually being accessed or called.
 *
 * unwrapExpression( node ); // node for `document!` -> node for `document`
 */
function unwrapExpression( node ) {
	let current = node;

	while ( current && ( isTypeScriptWrapperExpression( current ) || current.type === 'ChainExpression' ) ) {
		current = current.expression;
	}

	return current;
}

/**
 * Checks whether a path refers to the top-level document: `document`, `window.document`,
 * `global.document`, `global.window.document`, or any `*.ownerDocument` access.
 *
 * isDocumentAccessPath( 'window.document' ); // -> true
 */
function isDocumentAccessPath( path ) {
	return /^(global\.)?(window\.)?document$/.test( path ) || /\.ownerDocument$/.test( path );
}

/**
 * Checks whether a path refers to the top-level window: `window`, `global.window`, or any
 * `*.defaultView` access.
 *
 * isWindowAccessPath( 'global.window' ); // -> true
 */
function isWindowAccessPath( path ) {
	return /^(global\.)?window$/.test( path ) || /\.defaultView$/.test( path );
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
