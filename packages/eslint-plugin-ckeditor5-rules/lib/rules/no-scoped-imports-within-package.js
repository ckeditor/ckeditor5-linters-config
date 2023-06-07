/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const upath = require( 'upath' );
const fs = require( 'fs-extra' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow scoped import like "@ckeditor/*" to the same package where the import declaration is located.',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
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

		const directory = upath.dirname( context.getFilename() );
		const cwd = upath.normalizeTrim( context.getCwd() );
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

	if ( fs.pathExistsSync( packageJsonPath ) ) {
		const packageJson = fs.readJsonSync( packageJsonPath, { throws: false } );

		if ( packageJson ) {
			return packageJson.name;
		}
	}

	const parentDirectory = upath.dirname( directory );

	if ( parentDirectory.startsWith( cwd ) ) {
		return getPackageName( parentDirectory, cwd );
	}

	return null;
}
