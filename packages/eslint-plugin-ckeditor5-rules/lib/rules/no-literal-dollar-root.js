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

				context.report( {
					node,
					messageId: 'isElementDollarRoot',
					fix: fixer => {
						const objectText = sourceCode.getText( node.callee.object );
						const accessor = node.callee.optional ? '?.' : '.';

						return fixer.replaceText( node, `${ objectText }${ accessor }is( 'rootElement' )` );
					}
				} );
			},

			BinaryExpression( node ) {
				const match = matchNameEqualsDollarRoot( node );

				if ( !match ) {
					return;
				}

				const objectText = sourceCode.getText( match.object );
				const replacement = match.negated ? `!${ objectText }.is( 'rootElement' )` : `${ objectText }.is( 'rootElement' )`;

				context.report( {
					node,
					messageId: 'nameEqualsDollarRoot',
					data: { replacement },
					fix: fixer => fixer.replaceText( node, replacement )
				} );
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

/**
 * Whether the literal is the value of a `context` property — covers view-event listener options like
 * `listenTo( …, { context: '$root' } )` and `{ context: [ isWidget, '$root' ] }`. In that position `'$root'`
 * is a view-tree bubbling target, not the schema element name.
 */
function isAllowedViewEventContext( literalNode ) {
	const direct = literalNode.parent;
	let propertyNode = null;

	if ( direct && direct.type === 'Property' && direct.value === literalNode ) {
		propertyNode = direct;
	} else if ( direct && direct.type === 'ArrayExpression' ) {
		const arrayParent = direct.parent;

		if ( arrayParent && arrayParent.type === 'Property' && arrayParent.value === direct ) {
			propertyNode = arrayParent;
		}
	}

	if ( !propertyNode || propertyNode.computed ) {
		return false;
	}

	if ( propertyNode.key.type === 'Identifier' ) {
		return propertyNode.key.name === 'context';
	}

	if ( propertyNode.key.type === 'Literal' ) {
		return propertyNode.key.value === 'context';
	}

	return false;
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
