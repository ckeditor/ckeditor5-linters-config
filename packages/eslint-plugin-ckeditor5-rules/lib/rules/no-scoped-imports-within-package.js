/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'node:fs' );
const upath = require( 'upath' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow scoped import like "@ckeditor/*" to the same package where the import declaration is located.',
			category: 'CKEditor5',
			// eslint-disable-next-line @stylistic/max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#imports-within-a-package-ckeditor5-rulesno-scoped-imports-within-package'
		},
		schema: []
	},
	create( context ) {
		const handler = callbackFactory( context );

		return {
			ImportDeclaration: handler,
			ExportNamedDeclaration: handler,
			ExportAllDeclaration: handler
		};
	}
};

/**
 * @param {Object} context
 * @return {Function}
 */
function callbackFactory( context ) {
	return node => {
		if ( !node.source ) {
			return;
		}

		const importedPackageName = node.source.value;

		const isScopedImport =
			importedPackageName.startsWith( '@ckeditor/ckeditor5' ) ||
			importedPackageName.startsWith( 'ckeditor5' );

		if ( !isScopedImport ) {
			return;
		}

		const directory = upath.dirname( context.filename );
		const cwd = upath.normalizeTrim( context.cwd );
		const packageName = getPackageName( directory, cwd );

		if ( !packageName ) {
			return;
		}

		const isScopedImportToSamePackage =
			importedPackageName === packageName ||
			importedPackageName.startsWith( `${ packageName }/` );

		if ( isScopedImportToSamePackage ) {
			context.report( {
				node,
				message: 'Scoped import like "@ckeditor/*" to the same package where the import declaration is located is disallowed.'
			} );
		}
	};
}

/**
 * @param {String} directory
 * @param {String} cwd
 * @return {String|null}
 */
function getPackageName( directory, cwd ) {
	const packageJsonPath = upath.join( directory, 'package.json' );
	const packageJson = loadJson( packageJsonPath, 'utf-8' );

	if ( packageJson ) {
		return packageJson.name;
	}

	const parentDirectory = upath.dirname( directory );

	if ( parentDirectory.startsWith( cwd ) ) {
		return getPackageName( parentDirectory, cwd );
	}

	return null;
}

function loadJson( path ) {
	if ( !fs.existsSync( path ) ) {
		return;
	}

	const content = fs.readFileSync( path, 'utf-8' );

	if ( !content ) {
		return null;
	}

	try {
		return JSON.parse( content );
	} catch {
		return null;
	}
}
