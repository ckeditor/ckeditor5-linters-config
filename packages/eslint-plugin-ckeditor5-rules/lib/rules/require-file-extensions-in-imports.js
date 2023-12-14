/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { extname, dirname, sep, parse } = require( 'upath' );
const { isBuiltin } = require( 'module' );

// Could be replaced with oxc resolver once it's stable and if performance becomes an issue.
// https://oxc-project.github.io/docs/guide/usage/resolver.html
const enhancedResolve = require( 'enhanced-resolve' );

// https://github.com/npm/validate-npm-package-name/blob/2a17a08b298482f32ee217f1bba55c37e0935a0a/lib/index.js#L3
const packageFullPattern = new RegExp( '^(?:@([^/]+?)[/])?([^/]+?)$' );

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
			'missingFileExtension': 'Missing file extension in import "{{ url }}"'
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

		return {
			ImportDeclaration( node ) {
				const url = node.source.value;

				if ( extname( url ) ) {
					// URL already includes file extension.
					return;
				}

				if ( isBuiltin( url ) ) {
					// URL is native Node.js module, e.g. `fs` or `path`.
					return;
				}

				if ( packageFullPattern.test( url ) ) {
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
					 */
					const lastMatchingIndex = resolvedPathParts.findLastIndex( element => urlParts.includes( element ) );

					/**
					 * Concatenate parts of the path (after the `lastMatchingIndex`) to the end of the URL. Example:
					 *
					 * - Path: `/absolute/path/to/index.js`
					 * - URL: `../to`
					 * - Result: `../to/index` (no extension)
					 */
					const filePath = urlParts
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
		};
	}
};
