/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { URL } = require( 'node:url' );
const { extname, toUnix } = require( 'upath' );

const MAIN_PACKAGE_ENTRY_POINT_PATTERN = /\/packages\/[^/]+\/src\/index\.ts$/;

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
		if ( MAIN_PACKAGE_ENTRY_POINT_PATTERN.test( toUnix( filename ) ) ) {
			return {};
		}

		function validatePath( node ) {
			if ( !node.source || typeof node.source.value != 'string' ) {
				return;
			}

			// Resource queries and fragments (`./theme.css?raw`) are not part of the file path.
			const { pathname } = new URL( node.source.value, 'file:///' );

			if ( extname( pathname ) !== '.css' ) {
				return;
			}

			report( {
				node,
				message: 'CSS imports are only allowed in the main package entry point (`src/index.ts`).'
			} );
		}

		return {
			ImportDeclaration: validatePath,
			ImportExpression: validatePath,
			ExportAllDeclaration: validatePath,
			ExportNamedDeclaration: validatePath
		};
	}
};
