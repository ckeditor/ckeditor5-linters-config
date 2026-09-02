/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const DOCUMENT_ELEMENT_LOOKUP_METHODS = new Set( [
	'querySelector',
	'querySelectorAll',
	'getElementById',
	'getElementsByTagName',
	'getElementsByClassName',
	'getElementsByName'
] );

const DOCUMENT_LISTENER_EVENTS = new Set( [
	'mouseenter',
	'mouseleave',
	'pointerenter',
	'pointerleave',
	'scroll'
] );

const PARENT_TRAVERSAL_REPLACEMENTS = new Map( [
	[ 'parentNode', 'getParentNode' ],
	[ 'parentElement', 'getParentElement' ]
] );

const EXPRESSION_WRAPPERS = new Set( [
	'ChainExpression',
	'TSAsExpression',
	'TSNonNullExpression',
	'TSSatisfiesExpression',
	'TSTypeAssertion'
] );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow the use of utilities that cannot be used within the Shadow DOM',
			category: 'CKEditor5'
		},
		messages: {
			/* eslint-disable @stylistic/max-len */
			activeElement: 'Do not read `{{ path }}.activeElement` directly — it is not tracked across Shadow DOM boundaries.',
			shadowRootDiscovery: 'Do not use `.shadowRoot` for root discovery at read time, keep a held reference or use `getRootNode()` instead.',
			parentTraversal: 'Do not traverse `.{{ property }}` directly, use `{{ replacement }}()` instead — it does not cross Shadow DOM boundaries correctly.',
			relatedTarget: 'Do not use `relatedTarget` — it is retargeted at Shadow DOM boundaries, so it does not point at the actual node the pointer came from or went to.',
			getSelection: 'Do not call `{{ path }}(...)` directly — it does not account for Shadow DOM boundaries.',
			contains: 'Do not use `{{ path }}(...)`, use `isConnected` or `containsNode()` instead — `contains()` does not cross Shadow DOM boundaries.',
			elementFromPoint: 'Do not use `{{ path }}(...)` directly, resolve the point via the element\'s own root — `{{ path }}` ignores Shadow DOM.',
			caretFromPoint: 'Call `{{ path }}(...)` with a `{ shadowRoots }` option, otherwise it will not resolve carets inside Shadow DOM.',
			caretRangeFromPointUnsupported: 'Native `{{ path }}(...)` does not accept a `{ shadowRoots }` option and always ignores Shadow DOM, regardless of any argument passed.',
			documentElementLookup: 'Do not query `{{ path }}(...)` against the top-level document, query the editor\'s own root instead — it finds nothing inside a shadow root.',
			composedPath: 'Do not use `composedPath()` for root discovery, keep a held reference or use `getRootNode()` instead.',
			documentListener: 'Do not attach a `{{ event }}` listener on `{{ path }}` — it will not fire for events inside other shadow roots.',
			bodyAppendChild: 'Do not append directly to `{{ path }}` — it does not account for Shadow DOM boundaries.',
			documentTreeWalker: 'Do not call `{{ path }}(...)` rooted at `{{ root }}` — it will not traverse into descendant shadow roots.'
			/* eslint-enable @stylistic/max-len */
		}
	},

	create( context ) {
		const sourceCode = context.sourceCode;

		return {
			MemberExpression( node ) {
				const propertyName = getStaticPropertyName( node );

				if ( propertyName === 'activeElement' && isDocumentExpression( node.object ) ) {
					report( node, 'activeElement', { path: sourceCode.getText( unwrapExpression( node.object ) ) } );
				} else if ( propertyName === 'shadowRoot' ) {
					report( node, 'shadowRootDiscovery' );
				} else if ( PARENT_TRAVERSAL_REPLACEMENTS.has( propertyName ) ) {
					report( node, 'parentTraversal', {
						property: propertyName,
						replacement: PARENT_TRAVERSAL_REPLACEMENTS.get( propertyName )
					} );
				} else if ( propertyName === 'relatedTarget' ) {
					report( node, 'relatedTarget' );
				}
			},

			CallExpression( node ) {
				const callee = unwrapExpression( node.callee );
				const call = getCallTarget( callee );

				if ( !call ) {
					return;
				}

				// A bare call resolving to a locally imported or declared helper (e.g. a shadow-aware
				// `getSelection` wrapper) is fine — only the global functions are unsafe.
				if ( !call.receiver && isLocallyDefinedReference( callee ) ) {
					return;
				}

				const path = sourceCode.getText( callee );

				if ( call.name === 'getSelection' ) {
					// A bare `getSelection()` call always resolves to the global one here — locally
					// defined helpers were filtered out above.
					if ( !call.receiver ||
						isGlobalObjectExpression( call.receiver ) ||
						isWindowExpression( call.receiver ) ||
						isDocumentExpression( call.receiver )
					) {
						report( node, 'getSelection', { path } );
					}
				} else if ( call.name === 'contains' ) {
					// A `.body.contains(...)` call on a non-document object is allowed, since `body`
					// is a common, unrelated property name.
					if ( isDocumentOrBodyExpression( call.receiver ) ) {
						report( node, 'contains', { path } );
					}
				} else if ( call.name === 'elementFromPoint' || call.name === 'elementsFromPoint' ) {
					if ( isDocumentExpression( call.receiver ) ) {
						report( node, 'elementFromPoint', { path } );
					}
				} else if ( call.name === 'caretRangeFromPoint' || call.name === 'caretPositionFromPoint' ) {
					checkCaretFromPoint( node, call, path );
				} else if ( call.name === 'composedPath' ) {
					report( node, 'composedPath' );
				} else if ( DOCUMENT_ELEMENT_LOOKUP_METHODS.has( call.name ) ) {
					if ( isDocumentOrBodyExpression( call.receiver ) ) {
						report( node, 'documentElementLookup', { path } );
					}
				} else if ( call.name === 'addEventListener' || call.name === 'removeEventListener' ) {
					checkDocumentListener( node, call );
				} else if ( call.name === 'appendChild' ) {
					if ( isDocumentBodyExpression( call.receiver ) ) {
						report( node, 'bodyAppendChild', { path: sourceCode.getText( unwrapExpression( call.receiver ) ) } );
					}
				} else if ( call.name === 'createTreeWalker' || call.name === 'createNodeIterator' ) {
					checkDocumentTreeWalker( node, path );
				}
			}
		};

		function report( node, messageId, data ) {
			context.report( { node, messageId, data } );
		}

		/**
		 * Flags `caretRangeFromPoint(...)` / `caretPositionFromPoint(...)` calls that cannot resolve
		 * carets inside Shadow DOM. `caretRangeFromPoint(...)` only accepts coordinates and ignores
		 * additional options, so no argument can make it safe — the method name alone is enough to
		 * tell, no matter how the document the call is made on is spelled. Other calls are unsafe
		 * when missing a `{ shadowRoots }` option.
		 *
		 * domDoc.caretRangeFromPoint( x, y, { shadowRoots } ); // not allowed, the option is a no-op here
		 */
		function checkCaretFromPoint( node, call, path ) {
			if ( call.name === 'caretRangeFromPoint' ) {
				report( node, 'caretRangeFromPointUnsupported', { path } );
			} else if ( !hasShadowRootsOption( node.arguments ) ) {
				report( node, 'caretFromPoint', { path } );
			}
		}

		/**
		 * Flags `mouseenter` / `mouseleave` / `pointerenter` / `pointerleave` / `scroll` listeners
		 * attached to the top-level document, which will not fire for events inside other shadow
		 * roots.
		 *
		 * document.addEventListener( 'scroll', listener ); // not allowed
		 */
		function checkDocumentListener( node, call ) {
			if ( !isDocumentExpression( call.receiver ) ) {
				return;
			}

			const eventName = unwrapExpression( node.arguments[ 0 ] )?.value;

			if ( DOCUMENT_LISTENER_EVENTS.has( eventName ) ) {
				report( node, 'documentListener', {
					event: eventName,
					path: sourceCode.getText( unwrapExpression( call.receiver ) )
				} );
			}
		}

		/**
		 * Flags `createTreeWalker(...)` / `createNodeIterator(...)` rooted at the top-level document
		 * or its body, since neither traverses into descendant shadow roots. Only the root argument
		 * matters here — the receiver the factory is called on does not affect the traversal.
		 *
		 * document.createTreeWalker( document.body, NodeFilter.SHOW_ELEMENT ); // not allowed
		 */
		function checkDocumentTreeWalker( node, path ) {
			const root = node.arguments[ 0 ];

			if ( isDocumentOrBodyExpression( root ) ) {
				report( node, 'documentTreeWalker', { path, root: sourceCode.getText( root ) } );
			}
		}

		/**
		 * Checks whether an expression refers to the top-level document or its body.
		 */
		function isDocumentOrBodyExpression( node ) {
			return isDocumentExpression( node ) || isDocumentBodyExpression( node );
		}

		/**
		 * Checks whether an expression refers to the top-level document: `document`,
		 * `window.document`, `global.document`, `global.window.document`, their `globalThis` / `self`
		 * equivalents, or any `*.ownerDocument` access.
		 *
		 * isDocumentExpression( node ); // node for `window.document` -> true
		 */
		function isDocumentExpression( node ) {
			const expression = unwrapExpression( node );

			if ( isGlobalIdentifier( expression, 'document' ) ) {
				return true;
			}

			if ( expression?.type !== 'MemberExpression' ) {
				return false;
			}

			const propertyName = getStaticPropertyName( expression );

			if ( propertyName === 'ownerDocument' ) {
				return true;
			}

			return propertyName === 'document' && (
				isGlobalObjectExpression( expression.object ) ||
				isWindowExpression( expression.object )
			);
		}

		/**
		 * Checks whether an expression refers to the body of the top-level document.
		 *
		 * isDocumentBodyExpression( node ); // node for `global.document.body` -> true
		 */
		function isDocumentBodyExpression( node ) {
			const expression = unwrapExpression( node );

			return expression?.type === 'MemberExpression' &&
				getStaticPropertyName( expression ) === 'body' &&
				isDocumentExpression( expression.object );
		}

		/**
		 * Checks whether an expression refers to the top-level window: `window`, `self`,
		 * `global.window`, `globalThis.window`, or any `*.defaultView` access.
		 *
		 * isWindowExpression( node ); // node for `global.window` -> true
		 */
		function isWindowExpression( node ) {
			const expression = unwrapExpression( node );

			if ( isGlobalIdentifier( expression, 'window' ) || isGlobalIdentifier( expression, 'self' ) ) {
				return true;
			}

			if ( expression?.type !== 'MemberExpression' ) {
				return false;
			}

			const propertyName = getStaticPropertyName( expression );

			return propertyName === 'defaultView' ||
				( propertyName === 'window' && isGlobalObjectExpression( expression.object ) );
		}

		/**
		 * Checks whether an expression refers to the `global` or `globalThis` object.
		 */
		function isGlobalObjectExpression( node ) {
			const expression = unwrapExpression( node );

			return isGlobalIdentifier( expression, 'global' ) ||
				isGlobalIdentifier( expression, 'globalThis' );
		}

		/**
		 * Checks that an identifier has the expected global name and is not shadowed by a local
		 * binding.
		 */
		function isGlobalIdentifier( node, name ) {
			return node?.type === 'Identifier' &&
				node.name === name &&
				!isLocallyDefinedReference( node );
		}

		/**
		 * Checks whether an identifier reference resolves to a variable declared or imported in the
		 * source, as opposed to an unresolved global, a `global` directive comment-declared global,
		 * or a sloppy-mode implicit global created by an undeclared assignment.
		 *
		 * import { getSelection } from './shadow-dom-utils.js'; // resolves locally
		 */
		function isLocallyDefinedReference( node ) {
			const reference = sourceCode.getScope( node ).references.find( ref => ref.identifier === node );

			return reference?.resolved?.defs.some( definition => definition.type !== 'ImplicitGlobalVariable' ) ?? false;
		}
	}
};

/**
 * Extracts the static method name and receiver from a call target. For a bare identifier call the
 * receiver is `null`.
 */
function getCallTarget( callee ) {
	if ( callee.type === 'Identifier' ) {
		return { name: callee.name, receiver: null };
	}

	if ( callee.type !== 'MemberExpression' ) {
		return null;
	}

	const name = getStaticPropertyName( callee );

	return name ? { name, receiver: callee.object } : null;
}

/**
 * Returns the statically known name of a member property. In addition to dot notation, this covers
 * string and no-substitution template literal properties.
 *
 * getStaticPropertyName( node ); // node for `document[ 'body' ]` -> 'body'
 */
function getStaticPropertyName( node ) {
	return getStaticKeyName( node.property, node.computed );
}

/**
 * Returns the statically known name of a member property or object literal key: a plain identifier,
 * a string literal, or a no-substitution template literal. Other literal keys are ignored — they can
 * never spell any of the names this rule matches.
 */
function getStaticKeyName( key, computed ) {
	if ( !computed && key.type === 'Identifier' ) {
		return key.name;
	}

	if ( key.type === 'Literal' && typeof key.value === 'string' ) {
		return key.value;
	}

	if ( computed && key.type === 'TemplateLiteral' && key.expressions.length === 0 ) {
		return key.quasis[ 0 ].value.cooked;
	}

	return null;
}

/**
 * Checks whether the options argument is an object literal containing a `shadowRoots` property.
 * TypeScript and chain wrappers around the options object are ignored.
 */
function hasShadowRootsOption( args ) {
	const options = unwrapExpression( args[ 2 ] );

	return options?.type === 'ObjectExpression' && options.properties.some( property =>
		property.type === 'Property' && getStaticKeyName( property.key, property.computed ) === 'shadowRoots'
	);
}

/**
 * Strips TypeScript wrapper nodes (`x as Document`, `x!`, `<Document>x`, `x satisfies Document`),
 * and `ChainExpression` wrappers (parenthesized optional chains, e.g. `(x?.y)`) down to the
 * expression underneath, since none changes what is actually being accessed or called.
 *
 * unwrapExpression( node ); // node for `document!` -> node for `document`
 */
function unwrapExpression( node ) {
	let expression = node;

	while ( EXPRESSION_WRAPPERS.has( expression?.type ) ) {
		expression = expression.expression;
	}

	return expression;
}
