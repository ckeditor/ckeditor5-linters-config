/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow TypeScript enum declarations.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			noEnum: 'The TypeScript "enum" keyword is disallowed. Use a const object or union types instead.'
		}
	},
	create( context ) {
		return {
			TSEnumDeclaration( node ) {
				context.report( {
					node,
					messageId: 'noEnum'
				} );
			}
		};
	}
};
