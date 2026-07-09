/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { extname } = require( 'upath' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Allow `.css` imports only in the main package entry point (`src/index.ts`).',
			category: 'CKEditor5',
			// eslint-disable-next-line @stylistic/max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#css-imports-only-in-the-main-package-entry-point'
		}
	},
	create( { filename, report } ) {
		if ( filename.replaceAll( '\\', '/' ).endsWith( '/src/index.ts' ) ) {
			return {};
		}

		function validatePath( node ) {
			if ( !node.source ) {
				return;
			}

			if ( extname( node.source.value ) !== '.css' ) {
				return;
			}

			report( {
				node,
				message: 'CSS imports are only allowed in the main package entry point (`src/index.ts`).'
			} );
		}

		return {
			ImportDeclaration: validatePath,
			ExportAllDeclaration: validatePath,
			ExportNamedDeclaration: validatePath
		};
	}
};
