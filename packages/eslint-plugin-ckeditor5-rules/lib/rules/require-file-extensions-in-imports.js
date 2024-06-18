/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { normalize, extname, dirname, sep, parse } = require( 'upath' );
const { isBuiltin } = require( 'module' );
const { exports: resolveExports } = require( 'resolve.exports' );
const enhancedResolve = require( 'enhanced-resolve' );
const isValidNpmPackageName = require( 'validate-npm-package-name' );

const extensionsOverride = {
	'.ts': '.js'
};

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require file extensions in imports',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#mandatory-file-extensions-in-imports-ckeditor5-rulesrequire-file-extensions-in-imports'
		},
		fixable: 'code',
		messages: {
			'missingFileExtension': 'Missing file extension in import/export "{{ url }}"'
		},
		schema: [
			{
				type: 'object',
				properties: {
					extensions: {
						type: 'array',
						items: {
							type: 'string'
						}
					}
				}
			}
		]
	},
	create( context ) {
		const options = context.options[ 0 ] || {};

		const resolver = enhancedResolve.create.sync( {
			preferRelative: true,
			...options
		} );

		function validatePath( node ) {
			if ( !node.source ) {
				return;
			}

			const url = node.source.value;

			if ( extname( url ) ) {
				// URL already includes file extension.
				return;
			}

			if ( isBuiltin( url ) ) {
				// URL is native Node.js module, e.g. `fs` or `path`.
				return;
			}

			if ( isExternalPackage( url ) ) {
				// URL is third-party dependency, e.g. `lodash-es`
				return;
			}

			try {
				/**
				 * Below, "path" refers to the absolute path to the file in the file system (e.g. `/absolute/path/to/file.js`)
				 * and "URL" refers to the path used in the import (e.g. `./some/path` or `@scope/package`).
				 */

				// Resolve URL to absolute filesystem path.
				const resolvedPath = resolver( dirname( context.getFilename() ), url );

				// Turn `/absolute/path/to/file.js` into `[ 'absolute', 'path', 'to', 'file' ]`.
				const { dir: pathDir, name: pathName, ext: pathExt } = parse( resolvedPath );
				const { dir: urlDir, name: urlName } = parse( url );
				const resolvedPathParts = pathDir.split( sep ).concat( pathName );
				const urlParts = urlDir.split( sep ).concat( urlName );

				/**
				 * Find the last matching parts between the relative and absolute paths. Example:
				 *  - `/absolute/path/to/file.js` and `../to/file`
				 *                       ^^^^                ^^^^
				 *
				 * - `/absolute/path/to/index.js` and `../to`
				 *                   ^^                   ^^
				 *
				 * - `/absolute/path/to/index.js and `.`
				 *                   ^^               ^
				 */
				const lastMatchingIndex = resolvedPathParts.at( -1 ) === urlParts.at( -1 ) ?
					resolvedPathParts.length - 1 : // Get index containing file name
					resolvedPathParts.length - 2; // Get index containing directory name

				/**
				 * Concatenate parts of the path (after the `lastMatchingIndex`) to the end of the URL. Example:
				 *
				 * - Path: `/absolute/path/to/index.js`
				 * - URL: `../to`
				 * - Result: `../to/index` (no extension)
				 */
				const filePath = urlParts
					.filter( Boolean )
					.concat( resolvedPathParts.slice( lastMatchingIndex + 1 ) )
					.join( sep );

				// Get the original quoting style from the source code (" or ').
				const quoteStyle = node.source.raw[ 0 ];

				// Get the final file extension, prioritizing overrides.
				const extension = extensionsOverride[ pathExt ] || pathExt;

				// Issue can be automatically fixed.
				context.report( {
					node,
					messageId: 'missingFileExtension',
					data: {
						url
					},
					fix( fixer ) {
						return fixer.replaceText( node.source, quoteStyle + filePath + extension + quoteStyle );
					}
				} );
			} catch {
				// Automatic fix is not possible. Report a problem that needs to be fixed manually.
				context.report( {
					node,
					messageId: 'missingFileExtension',
					data: {
						url
					}
				} );
			}
		}

		return {
			ImportDeclaration: validatePath,
			ExportAllDeclaration: validatePath,
			ExportNamedDeclaration: validatePath
		};
	}
};

/**
 * Checks if path is a name of an external dependency, taking into account the `exports` field in `package.json`.
 *
 * It returns `false` if the package name is followed by a path that is not registered in the `exports` object.
 * Example: `@ckeditor/ckeditor5-core/src/index`.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isExternalPackage( url ) {
	if ( url.startsWith( '.' ) || url.startsWith( '/' ) ) {
		// URL is a relative or an absolute path.
		return false;
	}

	// Turn `@ckeditor/ckeditor5-core/src/index.js` into `[ '@ckeditor', 'ckeditor5-core', 'src', 'index.js' ]`.
	const parts = normalize( url ).split( sep );

	// Get the package name from the path parts.
	const packageName = parts
		.slice( 0, parts[ 0 ].startsWith( '@' ) ? 2 : 1 )
		.join( sep );

	if ( !isValidNpmPackageName( packageName ) ) {
		// URL is not a valid npm package name.
		return false;
	}

	if ( url === packageName ) {
		// URL is a valid npm package name and doesn't contain any additional paths after it.
		return true;
	}

	// Get path to the `package.json` of the external dependency relative to the current working directory.
	const packageJsonPath = require.resolve(
		`${ packageName }/package.json`,
		{ paths: [ process.cwd() ] }
	);

	// Load package.json file of the external dependency.
	const packageJson = require( packageJsonPath );

	if ( !packageJson.exports ) {
		// The package.json file doesn't contain the `exports` field.
		return false;
	}

	return resolveExports( packageJson, url ).every( extname );
}
