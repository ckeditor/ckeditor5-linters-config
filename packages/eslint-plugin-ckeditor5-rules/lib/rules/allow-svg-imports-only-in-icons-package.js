/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { extname } = require( 'upath' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Allow `.svg` imports only in the `@ckeditor/ckeditor5-icons` package',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#svg-imports-only-in-the-ckeditorckeditor5-icons-package'
		}
	},
	create( { filename, report } ) {
		if ( filename.includes( 'ckeditor5-icons' ) ) {
			return {};
		}

		function validatePath( node ) {
			if ( !node.source ) {
				return;
			}

			const extention = extname( node.source.value );

			if ( !extention || extention !== '.svg' ) {
				return;
			}

			report( {
				node,
				message: 'SVG imports are only allowed in the `@ckeditor/ckeditor5-icons` package.'
			} );
		}

		return {
			ImportDeclaration: validatePath,
			ExportAllDeclaration: validatePath,
			ExportNamedDeclaration: validatePath
		};
	}
};
