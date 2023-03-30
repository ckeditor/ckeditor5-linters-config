/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

// A regular expression that matches any import from the `src` directory in any CKEditor 5 build.
const CKEDITOR5_IMPORT_EXTENDING_BUILD_REGEXP = /^@ckeditor\/ckeditor5-build-[^/]+\/src($|\/)/;

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow import that extends a CKEditor 5 build.',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#importing-a-predefined-build-ckeditor5-rulesno-build-extensions'
		},
		schema: []
	},
	create( context ) {
		return {
			ImportDeclaration: node => {
				const importPath = node.source.value;

				if ( CKEDITOR5_IMPORT_EXTENDING_BUILD_REGEXP.test( importPath ) ) {
					context.report( {
						node,
						message: 'Import that extends a CKEditor 5 build is not allowed.'
					} );
				}
			}
		};
	}
};
