/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow hardcoding the "$root" string literal as a schema context outside engine/core.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					allowedPackages: {
						type: 'array',
						items: { type: 'string' }
					},
					allowedCalls: {
						type: 'array',
						items: { type: 'string' }
					}
				},
				additionalProperties: false
			}
		],
		messages: {
			literalDollarRoot:
				'Avoid hardcoding "$root" as a schema context — it is silently wrong when "config.root.modelElement" is customised. ' +
				'Use the configured root name (e.g. via "rootConfig.modelElement"), or use "rootElement" via ".is( \'rootElement\' )".',
			isElementDollarRoot:
				'Use ".is( \'rootElement\' )" instead of ".is( \'element\', \'$root\' )" — name-agnostic across configured roots.',
			nameEqualsDollarRoot:
				'Use "{{ replacement }}" instead of comparing ".name" against "$root" — name-agnostic across configured roots.'
		}
	},

	create( context ) {
		const options = context.options[ 0 ] || {};
		const allowedPackages = options.allowedPackages || [];
		const allowedCalls = options.allowedCalls || [];

		const filename = context.filename || '';

		if ( allowedPackages.some( pkg => filename.includes( pkg ) ) ) {
			return {};
		}

		const sourceCode = context.sourceCode;

		return {
			CallExpression( node ) {
				if ( !isIsElementDollarRootCall( node ) ) {
					return;
				}

				const report = {
					node,
					messageId: 'isElementDollarRoot'
				};

				// AST node ranges exclude grouping parens, so splicing `getText( object )` for a complex receiver
				// (e.g. `( a || b ).is( 'element', '$root' )`) would drop the parens and silently change operator
				// precedence. Skip the autofix in those cases — the developer rewrites by hand.
				if ( isSafeReceiver( node.callee.object ) ) {
					report.fix = fixer => {
						const objectText = sourceCode.getText( node.callee.object );
						const accessor = node.callee.optional ? '?.' : '.';

						return fixer.replaceText( node, `${ objectText }${ accessor }is( 'rootElement' )` );
					};
				}

				context.report( report );
			},

			BinaryExpression( node ) {
				const match = matchNameEqualsDollarRoot( node );

				if ( !match ) {
					return;
				}

				const objectText = sourceCode.getText( match.object );
				const safeReceiver = isSafeReceiver( match.object );
				// For unsafe receivers (e.g. `( a || b ).name === '$root'`) wrap the suggestion in parens so the
				// hint text in the message is itself valid; the actual autofix is skipped — see CallExpression note.
				const receiverText = safeReceiver ? objectText : `( ${ objectText } )`;
				const replacement = match.negated ?
					`!${ receiverText }.is( 'rootElement' )` :
					`${ receiverText }.is( 'rootElement' )`;

				const report = {
					node,
					messageId: 'nameEqualsDollarRoot',
					data: { replacement }
				};

				if ( safeReceiver ) {
					report.fix = fixer => fixer.replaceText( node, replacement );
				}

				context.report( report );
			},

			Literal( node ) {
				if ( node.value !== '$root' ) {
					return;
				}

				if ( isInsideAllowedCall( node, allowedCalls ) ) {
					return;
				}

				if ( isAllowedSchemaExtendForAttributes( node ) ) {
					return;
				}

				if ( isAllowedViewEventContext( node ) ) {
					return;
				}

				if ( isReportedByCallExpressionCheck( node ) ) {
					return;
				}

				if ( isReportedByBinaryExpressionCheck( node ) ) {
					return;
				}

				context.report( {
					node,
					messageId: 'literalDollarRoot'
				} );
			}
		};
	}
};

/**
 * Matches `<obj>.is( 'element', '$root' )` calls.
 */
function isIsElementDollarRootCall( node ) {
	const callee = node.callee;

	if ( !callee || callee.type !== 'MemberExpression' ) {
		return false;
	}

	if ( callee.computed || callee.property.type !== 'Identifier' || callee.property.name !== 'is' ) {
		return false;
	}

	if ( node.arguments.length !== 2 ) {
		return false;
	}

	const [ first, second ] = node.arguments;

	return isStringLiteral( first, 'element' ) && isStringLiteral( second, '$root' );
}

/**
 * Matches `<obj>.name === '$root'` and `<obj>.name !== '$root'` (and the flipped order).
 */
function matchNameEqualsDollarRoot( node ) {
	if ( node.operator !== '===' && node.operator !== '!==' ) {
		return null;
	}

	const left = node.left;
	const right = node.right;

	const fromLeft = matchNameAccessor( left ) && isStringLiteral( right, '$root' ) ? matchNameAccessor( left ) : null;
	const fromRight = matchNameAccessor( right ) && isStringLiteral( left, '$root' ) ? matchNameAccessor( right ) : null;

	const accessor = fromLeft || fromRight;

	if ( !accessor ) {
		return null;
	}

	return {
		object: accessor.object,
		negated: node.operator === '!=='
	};
}

/**
 * Matches a `<obj>.name` member expression. Returns the inner object on match.
 */
function matchNameAccessor( node ) {
	if ( !node || node.type !== 'MemberExpression' ) {
		return null;
	}

	if ( node.computed || node.property.type !== 'Identifier' || node.property.name !== 'name' ) {
		return null;
	}

	return { object: node.object };
}

function isStringLiteral( node, value ) {
	return node && node.type === 'Literal' && node.value === value;
}

/**
 * Whether splicing `sourceCode.getText( node )` directly into `${ text }.is( 'rootElement' )` is safe — i.e. the
 * receiver does not need parens to keep its semantics. Only nodes that bind tighter than member access qualify.
 */
function isSafeReceiver( node ) {
	if ( !node ) {
		return false;
	}

	switch ( node.type ) {
		case 'Identifier':
		case 'MemberExpression':
		case 'CallExpression':
		case 'ChainExpression':
		case 'ThisExpression':
			return true;
		default:
			return false;
	}
}

/**
 * Whether the literal sits as an argument to a call whose method name is in `allowedCalls`.
 */
function isInsideAllowedCall( literalNode, allowedCalls ) {
	if ( !allowedCalls.length ) {
		return false;
	}

	const parent = literalNode.parent;

	if ( !parent || parent.type !== 'CallExpression' ) {
		return false;
	}

	if ( !parent.arguments.includes( literalNode ) ) {
		return false;
	}

	const callee = parent.callee;

	if ( !callee || callee.type !== 'MemberExpression' || callee.computed ) {
		return false;
	}

	if ( callee.property.type !== 'Identifier' ) {
		return false;
	}

	return allowedCalls.includes( callee.property.name );
}

/**
 * Whether the literal is the first arg of `*.extend( '$root', { allowAttributes: … } )` — adding an attribute to the
 * default root model element is the documented escape hatch for features that only contribute attributes (not children
 * or any other schema rules), so it stays allowed even outside engine/core. Any extra key on the schema-rules object
 * disqualifies the call site and the literal is reported normally.
 */
function isAllowedSchemaExtendForAttributes( literalNode ) {
	const parent = literalNode.parent;

	if ( !parent || parent.type !== 'CallExpression' || parent.arguments[ 0 ] !== literalNode ) {
		return false;
	}

	const callee = parent.callee;

	if ( !callee || callee.type !== 'MemberExpression' || callee.computed ) {
		return false;
	}

	if ( callee.property.type !== 'Identifier' || callee.property.name !== 'extend' ) {
		return false;
	}

	const secondArg = parent.arguments[ 1 ];

	if ( !secondArg || secondArg.type !== 'ObjectExpression' || secondArg.properties.length !== 1 ) {
		return false;
	}

	const prop = secondArg.properties[ 0 ];

	if ( prop.type !== 'Property' || prop.computed ) {
		return false;
	}

	if ( prop.key.type === 'Identifier' ) {
		return prop.key.name === 'allowAttributes';
	}

	if ( prop.key.type === 'Literal' ) {
		return prop.key.value === 'allowAttributes';
	}

	return false;
}

const VIEW_LISTENER_METHODS = new Set( [ 'listenTo', 'on', 'once', 'off' ] );

/**
 * Whether the literal is the value of a `context` property on an options object passed to a view-event listener
 * call — `listenTo( …, { context: '$root' } )`, `view.on( 'event', cb, { context: [ isWidget, '$root' ] } )`, etc.
 * In that position `'$root'` is a view-tree bubbling target, not a schema element name.
 *
 * The check is intentionally narrow: only object literals passed to one of `listenTo`, `on`, `once`, `off` qualify,
 * so an unrelated call like `someApi( { context: '$root' } )` still gets flagged.
 */
function isAllowedViewEventContext( literalNode ) {
	const propertyNode = getOwningContextProperty( literalNode );

	if ( !isPropertyNamed( propertyNode, 'context' ) ) {
		return false;
	}

	const callExpression = getEnclosingObjectArgumentCall( propertyNode );

	return hasAllowedListenerMethod( callExpression );
}

/**
 * Returns the `Property` AST node whose value is the literal — directly (`{ context: literal }`) or via an inline
 * array (`{ context: [ ..., literal ] }`). Returns null when the literal is not in such a position.
 */
function getOwningContextProperty( literalNode ) {
	const parent = literalNode.parent;

	if ( parent && parent.type === 'Property' && parent.value === literalNode ) {
		return parent;
	}

	if ( parent && parent.type === 'ArrayExpression' ) {
		const propertyNode = parent.parent;

		if ( propertyNode && propertyNode.type === 'Property' && propertyNode.value === parent ) {
			return propertyNode;
		}
	}

	return null;
}

/**
 * Whether the property's key (identifier or string literal, never computed) equals `expectedName`.
 */
function isPropertyNamed( propertyNode, expectedName ) {
	if ( !propertyNode || propertyNode.computed ) {
		return false;
	}

	if ( propertyNode.key.type === 'Identifier' ) {
		return propertyNode.key.name === expectedName;
	}

	if ( propertyNode.key.type === 'Literal' ) {
		return propertyNode.key.value === expectedName;
	}

	return false;
}

/**
 * Returns the call expression that receives the property's enclosing object literal as one of its arguments.
 * Returns null when the property is not nested in a `<call>( …, { … }, … )` shape.
 */
function getEnclosingObjectArgumentCall( propertyNode ) {
	const objectLiteral = propertyNode && propertyNode.parent;

	if ( !objectLiteral || objectLiteral.type !== 'ObjectExpression' ) {
		return null;
	}

	const callExpression = objectLiteral.parent;

	if ( !callExpression || callExpression.type !== 'CallExpression' ) {
		return null;
	}

	if ( !callExpression.arguments.includes( objectLiteral ) ) {
		return null;
	}

	return callExpression;
}

/**
 * Whether the call's callee is a non-computed member expression invoking one of the allowed view-listener methods.
 */
function hasAllowedListenerMethod( callExpression ) {
	const callee = callExpression && callExpression.callee;

	return Boolean(
		callee &&
		callee.type === 'MemberExpression' &&
		!callee.computed &&
		callee.property.type === 'Identifier' &&
		VIEW_LISTENER_METHODS.has( callee.property.name )
	);
}

/**
 * Whether the literal is the second arg of a `.is( 'element', '$root' )` call (already reported by the CallExpression handler).
 */
function isReportedByCallExpressionCheck( literalNode ) {
	const parent = literalNode.parent;

	if ( !parent || parent.type !== 'CallExpression' ) {
		return false;
	}

	return isIsElementDollarRootCall( parent ) && parent.arguments[ 1 ] === literalNode;
}

/**
 * Whether the literal is the `'$root'` operand of a `<obj>.name === '$root'` comparison (already reported by the BinaryExpression handler).
 */
function isReportedByBinaryExpressionCheck( literalNode ) {
	const parent = literalNode.parent;

	if ( !parent || parent.type !== 'BinaryExpression' ) {
		return false;
	}

	return matchNameEqualsDollarRoot( parent ) !== null;
}
