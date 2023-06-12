/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Allow importing from "@ckeditor/*" modules only from the main package entry point.',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#importing-from-modules-ckeditor5-rulesallow-imports-only-from-main-package-entry-point'
		},
		schema: []
	},
	create( context ) {
		return {
			ImportDeclaration( node ) {
				if ( node.specifiers.length === 0 ) {
					// Ignore side-effect imports like "import '/modules/my-module.js'".
					return;
				}

				if ( !node.source.value.startsWith( '@ckeditor/' ) ) {
					// Ignore packages whose names don't start with '@ckeditor/'.
					return;
				}

				if ( !node.source.value.includes( '/src/' ) ) {
					// Ignore imports that don't include 'src'.
					return;
				}

				context.report( {
					node,
					// eslint-disable-next-line max-len
					message: 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point, not from their "/src" folder.'
				} );
			}
		};
	}
};
