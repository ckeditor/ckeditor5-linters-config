/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const DEFAULT_METHODS = [ 'parse', 'toModel' ];

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require an explicit schema context when calling "data.parse()" / "data.toModel()".',
			category: 'CKEditor5'
		},
		schema: [
			{
				type: 'object',
				properties: {
					methods: {
						type: 'array',
						items: { type: 'string' }
					}
				},
				additionalProperties: false
			}
		],
		messages: {
			missingContext:
				'Pass an explicit schema context to "data.{{ method }}()". Without it the API falls back to "$root", ' +
				'which is silently wrong when "config.root.modelElement" is customised. ' +
				'If you have verified that the default is acceptable here, opt out with an ' +
				'"// eslint-disable-next-line" comment that explains why.'
		}
	},

	create( context ) {
		const options = context.options[ 0 ] || {};
		const methods = options.methods || DEFAULT_METHODS;

		return {
			CallExpression( node ) {
				if ( node.arguments.length !== 1 ) {
					return;
				}

				const callee = node.callee;

				if ( !callee || callee.type !== 'MemberExpression' || callee.computed ) {
					return;
				}

				if ( callee.property.type !== 'Identifier' || !methods.includes( callee.property.name ) ) {
					return;
				}

				if ( !isDataReceiver( callee.object ) ) {
					return;
				}

				context.report( {
					node,
					messageId: 'missingContext',
					data: { method: callee.property.name }
				} );
			}
		};
	}
};

/**
 * Whether the receiver looks like a `data` reference:
 * - a bare `Identifier` named `data` (covers `const { data } = editor; data.parse( … )`),
 * - or a `MemberExpression` whose final accessed property is `data` (covers `editor.data`, `this.data`, `foo.bar.data`, etc.).
 */
function isDataReceiver( node ) {
	if ( !node ) {
		return false;
	}

	if ( node.type === 'Identifier' && node.name === 'data' ) {
		return true;
	}

	if ( node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier' && node.property.name === 'data' ) {
		return true;
	}

	return false;
}
