/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { URL } = require( 'node:url' );
const { extname, toUnix } = require( 'upath' );

const MAIN_PACKAGE_ENTRY_POINT_PATTERN = /(^|\/)packages\/[^/]+\/src\/index\.ts$/;

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
			if ( !node.source ) {
				return;
			}

			const importPath = getStaticImportPath( node.source );

			if ( importPath === null ) {
				return;
			}

			if ( !isCssImportPath( importPath ) ) {
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

/**
 * Returns the import path when it is statically known: a string literal or a template
 * literal without expressions. Returns `null` for paths built at runtime.
 */
function getStaticImportPath( source ) {
	if ( typeof source.value == 'string' ) {
		return source.value;
	}

	if ( source.type == 'TemplateLiteral' && source.expressions.length == 0 ) {
		return source.quasis[ 0 ].value.cooked ?? null;
	}

	return null;
}

/**
 * Checks whether an import path points to a CSS file, ignoring the resource query and
 * fragment (`./theme.css?raw`), which are not part of the file path.
 */
function isCssImportPath( importPath ) {
	let pathname;

	try {
		pathname = new URL( importPath, 'file:///' ).pathname;
	} catch {
		// Malformed paths that cannot be parsed as a URL are checked as-is.
		// The rule must not crash on a typo in an import path.
		pathname = importPath;
	}

	return extname( pathname ) === '.css';
}
