/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow default exports.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		schema: [],
		messages: {
			noDefault: 'Default exports are disallowed. Use a named export instead.'
		}
	},
	create( context ) {
		return {
			// Handle `export default ...`.
			ExportDefaultDeclaration( node ) {
				context.report( {
					node,
					messageId: 'noDefault'
				} );
			},

			// Handle `export { something as default } from '...'`.
			ExportNamedDeclaration( node ) {
				if ( !node.specifiers || node.specifiers.length === 0 ) {
					return;
				}

				for ( const spec of node.specifiers ) {
					if (
						spec.type === 'ExportSpecifier' &&
						spec.exported &&
						spec.exported.type === 'Identifier' &&
						spec.exported.name === 'default'
					) {
						context.report( {
							node: spec,
							messageId: 'noDefault'
						} );
					}
				}
			}
		};
	}
};
