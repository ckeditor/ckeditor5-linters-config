/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require the use of "as const" in all return statements for methods with given names.',
			category: 'CKEditor5',
			// eslint-disable-next-line @stylistic/max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#require-as-const-ckeditor5-rulesrequire-as-const-returns-in-methods'
		},
		schema: [
			{
				type: 'object',
				properties: {
					methodNames: {
						type: 'array',
						items: {
							type: 'string'
						}
					}
				}
			}
		]
	},
	create( context ) {
		const methodNames = context.options[ 0 ] ? context.options[ 0 ].methodNames : null;
		let inMethod = false;
		const returnStatements = [];

		function showError( node ) {
			context.report( {
				node,
				message: 'Not all return statements end with "as const".'
			} );
		}

		return {
			MethodDefinition( node ) {
				if ( node.accessibility !== 'public' ) {
					// Skip non-public methods.
					return;
				}

				if ( node.value.type === 'TSEmptyBodyFunctionExpression' ) {
					// Skip methods without a body.
					return;
				}

				if ( methodNames && !methodNames.includes( node.key.name ) ) {
					// Skip methods if their name don't match provided names.
					return;
				}

				if ( node.value.returnType ) {
					context.report( {
						node,
						message: 'Methods that require return statements to end with "as const" cannot specify a return type.'
					} );
				}

				inMethod = true;
			},

			ReturnStatement( node ) {
				if ( !inMethod ) {
					return;
				}

				returnStatements.push( node );
			},

			'MethodDefinition:exit'( node ) {
				if ( !inMethod ) {
					return;
				}

				inMethod = false;

				if ( !returnStatements.length ) {
					return showError( node );
				}

				const allReturnStatementsUseAsConst = returnStatements.every( ( { argument } ) => {
					return argument &&
						argument.type === 'TSAsExpression' &&
						argument.typeAnnotation &&
						argument.typeAnnotation.typeName &&
						argument.typeAnnotation.typeName.name === 'const';
				} );

				if ( allReturnStatementsUseAsConst ) {
					return;
				}

				showError( node );
			}
		};
	}
};
