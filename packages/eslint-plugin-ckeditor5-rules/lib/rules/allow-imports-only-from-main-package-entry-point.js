/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'node:fs' );
const { findPackageJSON } = require( 'node:module' );
const { pathToFileURL } = require( 'node:url' );
const resolveExports = require( 'resolve.exports' ).exports;

const message = 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point.';
const packageJsonCache = new Map();

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Allow importing from "@ckeditor/*" modules only from the main package entry point.',
			category: 'CKEditor5',
			// eslint-disable-next-line @stylistic/max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#importing-from-modules-ckeditor5-rulesallow-imports-only-from-main-package-entry-point'
		},
		fixable: 'code',
		schema: []
	},
	create( context ) {
		return {
			ImportDeclaration( node ) {
				if ( node.specifiers.length === 0 ) {
					// Ignore side-effect imports like "import '/modules/my-module.js'".
					return;
				}

				const path = node.source.value;
				const match = path.match( /@ckeditor\/[^/]+/ );

				if ( !match ) {
					// Ignore imports that do not match with the '@ckeditor/package-name' pattern.
					return;
				}

				if ( path === match[ 0 ] ) {
					// Ignore imports from the main package entry point.
					return;
				}

				if ( isExportedPackageSubpath( path, match[ 0 ], context ) ) {
					// Ignore imports from package subpaths explicitly defined in the `exports` field.
					return;
				}

				const isTestUtil = path.match( /\/tests\/(.+\/)*_utils/ );

				if ( isTestUtil ) {
					return;
				}

				const defaultImport = node.specifiers.find( item => item.type === 'ImportDefaultSpecifier' );
				const namedImport = node.specifiers.find( item => item.type === 'ImportSpecifier' );

				// If import uses both default and named imports, we don't know how to fix it.
				if ( defaultImport && namedImport ) {
					return context.report( { node, message } );
				}

				context.report( {
					node,
					message,
					fix: fixer => {
						const fixes = [
							fixer.replaceTextRange( node.source.range, `'${ match[ 0 ] }'` )
						];

						if ( defaultImport ) {
							fixes.push( fixer.replaceTextRange( defaultImport.range, `{ ${ defaultImport.local.name } }` ) );
						}

						return fixes;
					}
				} );
			}
		};
	}
};

function isExportedPackageSubpath( importPath, packageName, context ) {
	try {
		const packageJsonPath = findPackageJSON( importPath, pathToFileURL( context.physicalFilename ) );
		const packageJson = readPackageJson( packageJsonPath );
		const subpath = `.${ importPath.slice( packageName.length ) }`;

		if ( !packageJson?.exports ) {
			return false;
		}

		resolveExports( packageJson, subpath );

		return true;
	} catch {
		return false;
	}
}

function readPackageJson( packageJsonPath ) {
	if ( !packageJsonCache.has( packageJsonPath ) ) {
		try {
			packageJsonCache.set( packageJsonPath, JSON.parse( fs.readFileSync( packageJsonPath, 'utf8' ) ) );
		} catch {
			packageJsonCache.set( packageJsonPath, null );
		}
	}

	return packageJsonCache.get( packageJsonPath );
}
