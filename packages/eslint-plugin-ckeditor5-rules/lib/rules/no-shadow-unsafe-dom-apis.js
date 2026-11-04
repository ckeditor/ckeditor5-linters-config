/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { unwrapExpression } = require( '../utils/unwrap-expression' );

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

// The top-level objects whose APIs this rule restricts, as resolved by `getExpressionKind()`.
const DOCUMENT = 'document';
const BODY = 'body';
const WINDOW = 'window';
const GLOBAL = 'global';

const GLOBAL_IDENTIFIER_KINDS = new Map( [
	[ 'document', DOCUMENT ],
	[ 'window', WINDOW ],
	[ 'self', WINDOW ],
	[ 'global', GLOBAL ],
	[ 'globalThis', GLOBAL ]
] );

// DOM type names from TypeScript's `lib.dom.d.ts` that denote one of the tracked objects.
const TYPE_NAME_KINDS = new Map( [
	[ 'Document', DOCUMENT ],
	[ 'HTMLDocument', DOCUMENT ],
	[ 'HTMLBodyElement', BODY ],
	[ 'Window', WINDOW ]
] );

const GET_SELECTION_RECEIVER_KINDS = [ DOCUMENT, WINDOW, GLOBAL ];

const NULLISH_TYPES = new Set( [ 'TSNullKeyword', 'TSUndefinedKeyword' ] );

const CLASS_FIELD_TYPES = new Set( [
	'PropertyDefinition',
	'AccessorProperty',
	'TSAbstractPropertyDefinition',
	'TSAbstractAccessorProperty'
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
				checkPropertyRead( node, getStaticPropertyName( node ), () => ( {
					kind: getExpressionKind( node.object ),
					path: sourceCode.getText( unwrapExpression( node.object ) )
				} ) );
			},

			// The destructuring counterpart of the check above, e.g. `const { activeElement } = doc`.
			ObjectPattern( node ) {
				const source = getPatternSource( node );

				for ( const property of node.properties ) {
					const propertyName = property.type === 'Property' && getStaticKeyName( property.key, property.computed );

					checkPropertyRead( property, propertyName, () => source );

					// A destructured `getSelection` is later called bare, which `CallExpression` allows.
					if ( propertyName === 'getSelection' && GET_SELECTION_RECEIVER_KINDS.includes( source.kind ) ) {
						report( property, 'getSelection', { path: `${ source.path }.getSelection` } );
					}
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
					if ( !call.receiver || isKind( call.receiver, ...GET_SELECTION_RECEIVER_KINDS ) ) {
						report( node, 'getSelection', { path } );
					}
				} else if ( call.name === 'contains' ) {
					// A `.body.contains(...)` call on a non-document object is allowed, since `body`
					// is a common, unrelated property name.
					if ( isKind( call.receiver, DOCUMENT, BODY ) ) {
						report( node, 'contains', { path } );
					}
				} else if ( call.name === 'elementFromPoint' || call.name === 'elementsFromPoint' ) {
					if ( isKind( call.receiver, DOCUMENT ) ) {
						report( node, 'elementFromPoint', { path } );
					}
				} else if ( call.name === 'caretPositionFromPoint' ) {
					checkCaretPositionFromPoint( node, path );
				} else if ( call.name === 'composedPath' ) {
					report( node, 'composedPath' );
				} else if ( DOCUMENT_ELEMENT_LOOKUP_METHODS.has( call.name ) ) {
					if ( isKind( call.receiver, DOCUMENT, BODY ) ) {
						report( node, 'documentElementLookup', { path } );
					}
				} else if ( call.name === 'addEventListener' || call.name === 'removeEventListener' ) {
					checkDocumentListener( node, call );
				} else if ( call.name === 'appendChild' ) {
					if ( isKind( call.receiver, BODY ) ) {
						report( node, 'bodyAppendChild', { path: sourceCode.getText( unwrapExpression( call.receiver ) ) } );
					}
				} else if ( call.name === 'createTreeWalker' || call.name === 'createNodeIterator' ) {
					checkDocumentTreeWalker( node, path );
				}
			}
		};

		/**
		 * Flags reading a restricted property, through a member access or by destructuring.
		 * `getSource()` describes the object it is read from as `{ kind, path }` — only
		 * `activeElement` depends on it, so it is resolved lazily.
		 *
		 * const { activeElement } = document; // not allowed
		 */
		function checkPropertyRead( node, propertyName, getSource ) {
			if ( propertyName === 'activeElement' ) {
				const source = getSource();

				if ( source.kind === DOCUMENT ) {
					report( node, 'activeElement', { path: source.path } );
				}
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
		}

		function report( node, messageId, data ) {
			context.report( { node, messageId, data } );
		}

		/**
		 * Flags `caretPositionFromPoint(...)` calls missing a `{ shadowRoots }` option, without which
		 * they do not resolve carets inside Shadow DOM.
		 *
		 * Legacy `caretRangeFromPoint(...)` is not reported at all. It accepts coordinates only and
		 * has no shadow-aware form, so it is used exactly where `caretPositionFromPoint(...)` is
		 * unavailable — there is nothing to switch to and no option to add.
		 *
		 * document.caretPositionFromPoint( x, y ); // not allowed, the option is missing
		 */
		function checkCaretPositionFromPoint( node, path ) {
			if ( !hasShadowRootsOption( node.arguments ) ) {
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
			if ( !isKind( call.receiver, DOCUMENT ) ) {
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

			if ( isKind( root, DOCUMENT, BODY ) ) {
				report( node, 'documentTreeWalker', { path, root: sourceCode.getText( root ) } );
			}
		}

		/**
		 * Checks whether an expression refers to one of the given tracked objects.
		 *
		 * isKind( node, DOCUMENT, BODY ); // node for `doc.body` in `function f( doc: Document ) { doc.body; }` -> true
		 */
		function isKind( node, ...kinds ) {
			return kinds.includes( getExpressionKind( node ) );
		}

		/**
		 * Resolves which tracked top-level object an expression refers to: `DOCUMENT`, `BODY`, `WINDOW`,
		 * `GLOBAL`, or `null` when none (or it cannot be told statically).
		 *
		 * Besides the global access paths (`document`, `window.document`, `self`, `*.ownerDocument`,
		 * `*.defaultView`, `document.body`, ...), the kind is taken from what TypeScript knows from the
		 * source: casts (`node as Document`), annotations of variables and parameters (`doc: Document`,
		 * `win: Window | null`, `t: typeof document`), or — without an annotation — the initializer or
		 * default value (`const doc = el.ownerDocument`), destructured bindings (`const { body } = doc`)
		 * and class members read through `this` (fields, parameter properties, getters).
		 *
		 * A type name that resolves to a local declaration or import (e.g. the editor model's own
		 * `Document`) is not the DOM type.
		 */
		function getExpressionKind( node, visited = new Set() ) {
			let expression = node;

			// Casts (`as`, `satisfies`, `<Type>`) carry a `typeAnnotation`; the outermost tracked one wins.
			while ( expression && expression !== unwrapExpression( expression ) ) {
				const kind = getTypeKind( expression.typeAnnotation, visited );

				if ( kind ) {
					return kind;
				}

				expression = expression.expression;
			}

			if ( expression?.type === 'Identifier' ) {
				const variable = getLocalVariable( expression );

				return variable ? getVariableKind( variable, visited ) : GLOBAL_IDENTIFIER_KINDS.get( expression.name ) ?? null;
			}

			if ( expression?.type !== 'MemberExpression' ) {
				return null;
			}

			const propertyName = getStaticPropertyName( expression );

			if ( propertyName === 'ownerDocument' || propertyName === 'defaultView' ) {
				return getMemberKind( null, propertyName );
			}

			if ( expression.object.type === 'ThisExpression' ) {
				return getThisMemberKind( expression, visited );
			}

			return getMemberKind( getExpressionKind( expression.object, visited ), propertyName );
		}

		/**
		 * Resolves the kind of a type node. A union is tracked only when all its non-nullish members
		 * are the same kind (`Document | null` is, `Document | ShadowRoot` is not), an intersection
		 * takes its first tracked member (`Window & typeof globalThis` is `WINDOW`).
		 */
		function getTypeKind( node, visited ) {
			switch ( node?.type ) {
				case 'TSTypeAnnotation':
					return getTypeKind( node.typeAnnotation, visited );

				case 'TSTypeReference':
					return node.typeName.type === 'Identifier' && !isLocallyDefinedReference( node.typeName ) ?
						TYPE_NAME_KINDS.get( node.typeName.name ) ?? null :
						null;

				case 'TSUnionType': {
					const kinds = new Set( node.types
						.filter( type => !NULLISH_TYPES.has( type.type ) )
						.map( type => getTypeKind( type, visited ) ) );

					return kinds.size === 1 ? [ ...kinds ][ 0 ] : null;
				}

				case 'TSIntersectionType':
					return node.types.map( type => getTypeKind( type, visited ) ).find( Boolean ) ?? null;

				// `typeof document`, `typeof doc`, `typeof window.document`.
				case 'TSTypeQuery':
					return getTypeKind( node.exprName, visited );

				case 'TSQualifiedName':
					return getMemberKind( getTypeKind( node.left, visited ), node.right.name );

				case 'Identifier':
					return getExpressionKind( node, visited );
			}

			return null;
		}

		/**
		 * Resolves the kind of a locally declared variable from its declarations.
		 */
		function getVariableKind( variable, visited ) {
			return withCycleGuard( visited, variable, () =>
				variable.defs.map( definition => getBindingKind( definition.name, visited ) ).find( Boolean ) ?? null
			);
		}

		/**
		 * Resolves the kind of a declared binding: its annotation, otherwise its initializer, default
		 * value, or the object pattern it is destructured from.
		 *
		 * const doc: Document = x; // DOCUMENT
		 * const win = doc.defaultView; // WINDOW
		 * const { body } = document; // BODY
		 */
		function getBindingKind( binding, visited ) {
			if ( binding.typeAnnotation ) {
				return getTypeKind( binding.typeAnnotation, visited );
			}

			const { parent } = binding;
			const property = getPatternProperty( binding );

			if ( property ) {
				return getMemberKind(
					getPatternSource( property.parent, visited ).kind,
					getStaticKeyName( property.key, property.computed )
				);
			}

			if ( parent.type === 'VariableDeclarator' && parent.id === binding ) {
				return getExpressionKind( parent.init, visited );
			}

			// A parameter's default value.
			return parent.type === 'AssignmentPattern' && parent.left === binding ? getExpressionKind( parent.right, visited ) : null;
		}

		/**
		 * Finds what an object pattern destructures — its own annotation, the initializer, assigned or
		 * default value, or the matching member of the enclosing pattern's source — as `{ kind, path }`.
		 *
		 * getPatternSource( node ); // node for `{ activeElement }` in `const { activeElement } = doc` -> { kind: DOCUMENT, path: 'doc' }
		 */
		function getPatternSource( pattern, visited = new Set() ) {
			if ( pattern.typeAnnotation ) {
				return {
					kind: getTypeKind( pattern.typeAnnotation, visited ),
					path: sourceCode.getText( pattern.typeAnnotation.typeAnnotation )
				};
			}

			const property = getPatternProperty( pattern );

			if ( property ) {
				const outer = getPatternSource( property.parent, visited );
				const key = getStaticKeyName( property.key, property.computed );

				return { kind: getMemberKind( outer.kind, key ), path: `${ outer.path }.${ key }` };
			}

			const { parent } = pattern;
			const value = parent.type === 'VariableDeclarator' ? parent.init : parent.left === pattern && parent.right;

			return value ?
				{ kind: getExpressionKind( value, visited ), path: sourceCode.getText( unwrapExpression( value ) ) } :
				{ kind: null, path: '' };
		}

		/**
		 * Resolves the kind of `this.member` from the member's declaration in the enclosing class: a
		 * field, a getter's return type, or a constructor parameter property.
		 *
		 * class Foo { private _doc: Document; bar() { this._doc; } } // DOCUMENT
		 */
		function getThisMemberKind( node, visited ) {
			const classBody = getThisClassBody( node );
			const name = getMemberKey( node.property, node.computed );

			for ( const member of classBody && name ? classBody.body : [] ) {
				const key = member.key && !member.static && getMemberKey( member.key, member.computed );

				if ( CLASS_FIELD_TYPES.has( member.type ) && key === name ) {
					return withCycleGuard( visited, member, () => member.typeAnnotation ?
						getTypeKind( member.typeAnnotation, visited ) :
						getExpressionKind( member.value, visited )
					);
				}

				if ( member.kind === 'get' && key === name ) {
					return getTypeKind( member.value.returnType, visited );
				}

				if ( member.kind === 'constructor' ) {
					const binding = member.value.params
						.filter( param => param.type === 'TSParameterProperty' )
						.map( param => param.parameter.left ?? param.parameter )
						.find( parameter => parameter.name === name );

					if ( binding ) {
						return getBindingKind( binding, visited );
					}
				}
			}

			return null;
		}

		/**
		 * Checks whether an identifier reference resolves to a variable declared or imported in the
		 * source, as opposed to an unresolved global, a `global` directive comment-declared global,
		 * or a sloppy-mode implicit global created by an undeclared assignment.
		 *
		 * import { getSelection } from './shadow-dom-utils.js'; // resolves locally
		 */
		function isLocallyDefinedReference( node ) {
			return getLocalVariable( node ) !== null;
		}

		/**
		 * Returns the locally declared or imported variable an identifier reference resolves to, or
		 * `null` for globals (see `isLocallyDefinedReference()`).
		 */
		function getLocalVariable( node ) {
			const reference = sourceCode.getScope( node ).references.find( ref => ref.identifier === node );
			const variable = reference?.resolved;

			return variable?.defs.some( definition => definition.type !== 'ImplicitGlobalVariable' ) ? variable : null;
		}
	}
};

/**
 * Resolves the kind of a member read off an object of a known kind (`objectKind` may be `null`).
 *
 * getMemberKind( WINDOW, 'document' ); // -> DOCUMENT
 * getMemberKind( null, 'ownerDocument' ); // -> DOCUMENT
 */
function getMemberKind( objectKind, propertyName ) {
	if ( propertyName === 'ownerDocument' ) {
		return DOCUMENT;
	}

	if ( propertyName === 'defaultView' ) {
		return WINDOW;
	}

	if ( propertyName === 'document' && ( objectKind === WINDOW || objectKind === GLOBAL ) ) {
		return DOCUMENT;
	}

	if ( propertyName === 'window' && objectKind === GLOBAL ) {
		return WINDOW;
	}

	return propertyName === 'body' && objectKind === DOCUMENT ? BODY : null;
}

/**
 * Returns the object pattern `Property` whose value is the given node, also through a default
 * value (`{ key: node = fallback }`), or `null`.
 */
function getPatternProperty( node ) {
	const target = node.parent.type === 'AssignmentPattern' && node.parent.left === node ? node.parent : node;
	const property = target.parent;

	return property?.type === 'Property' && property.value === target && property.parent.type === 'ObjectPattern' ? property : null;
}

/**
 * Runs `callback` unless `key` is already being resolved up the call stack, which breaks cycles
 * like `let a = b, b = a` or `class Foo { doc = this.doc; }`.
 */
function withCycleGuard( visited, key, callback ) {
	if ( visited.has( key ) ) {
		return null;
	}

	visited.add( key );

	try {
		return callback();
	} finally {
		visited.delete( key );
	}
}

/**
 * Finds the body of the class whose instance `this` refers to at the given node, or `null` when
 * `this` is not a class instance there (a plain function, a static member, an object method, ...).
 */
function getThisClassBody( node ) {
	for ( let current = node.parent; current; current = current.parent ) {
		if ( current.type === 'ClassBody' ) {
			return current;
		}

		const isInstanceMethod = current.type === 'FunctionExpression' && current.parent.type === 'MethodDefinition';
		const isTransparent = current.type !== 'FunctionExpression' && current.type !== 'FunctionDeclaration' &&
			current.type !== 'StaticBlock';

		if ( current.static || !( isInstanceMethod || isTransparent ) ) {
			return null;
		}
	}

	return null;
}

/**
 * Returns the statically known name of a class member key or member property. Private names are
 * prefixed with `#`, so they never match the public names this rule tracks.
 */
function getMemberKey( key, computed ) {
	return key.type === 'PrivateIdentifier' ? `#${ key.name }` : getStaticKeyName( key, computed );
}

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
