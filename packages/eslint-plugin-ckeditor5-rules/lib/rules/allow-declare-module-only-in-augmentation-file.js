/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const upath = require( 'upath' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Allow using module augmentation for "@ckeditor/ckeditor5-core" modules only in the "/src/augmentation.ts" files.',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#declaring-module-augmentation-for-the-core-package-ckeditor5-rulesallow-declare-module-only-in-augmentation-file'
		}
	},
	create( context ) {
		return {
			TSModuleDeclaration( node ) {
				if ( node.id.value !== '@ckeditor/ckeditor5-core' ) {
					// Skip module declarations other than '@ckeditor/ckeditor5-core'.
					return;
				}

				const normalizedPath = upath.toUnix( context.getFilename() );

				if ( normalizedPath.endsWith( '/src/augmentation.ts' ) ) {
					// Skip if module declaration is already in the specified file.
					return;
				}

				context.report( {
					node,
					// eslint-disable-next-line max-len
					message: 'Module augmentation for the "@ckeditor/ckeditor5-core" package is only allowed in "src/augmentation.ts" files.'
				} );
			}
		};
	}
};
