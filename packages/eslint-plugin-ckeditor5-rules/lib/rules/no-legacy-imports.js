/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

// Allowed packages to be checked.
const corePackageName = 'ckeditor5';
const premiumPackageName = 'ckeditor5-premium-features';

// Default packages to check.
const defaultPackages = [
	corePackageName,
	premiumPackageName
];

// Package dependency cache to avoid excessive file reads.
const cache = new Map();

/**
 * Returns an array of dependencies of a given package.
 *
 * @param {string} packageName
 * @returns {Array<string>}
 */
function getDependencies( packageName ) {
	if ( cache.has( packageName ) ) {
		return cache.get( packageName );
	}

	try {
		const packageJsonPath = require.resolve(
			`${ packageName }/package.json`,
			{ paths: [ process.cwd() ] }
		);

		const packageJson = require( packageJsonPath );
		const dependencies = Object.keys( packageJson.dependencies || {} );

		cache.set( packageName, dependencies );

		return dependencies;
	} catch {
		cache.set( packageName, [] );

		return [];
	}
}

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow legacy imports from CKEditor5 packages.',
			category: 'CKEditor5',
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#no-legacy-imports'
		},
		fixable: 'code',
		messages: {
			legacyImport: 'Import must be done from the "{{ packageName }}" package'
		},
		schema: [
			{
				type: 'object',
				properties: {
					packages: {
						type: 'array',
						items: [
							// Allow only core and premium packages to be checked.
							{
								anyOf: [
									{
										enum: [ corePackageName, premiumPackageName ]
									}
								]
							}
						]
					}
				}
			}
		]
	},
	create( context ) {
		// Get the packages to check from the rule options.
		const { packages = defaultPackages } = context.options[ 0 ] || {};

		/**
		 * Checks if the given path is an invalid core package import.
		 *
		 * @param {string} path
		 * @returns boolean
		 */
		function isInvalidCoreImport( path ) {
			return packages.includes( corePackageName ) &&
				getDependencies( corePackageName ).includes( path ) ||
				path.startsWith( 'ckeditor5/src/' );
		}

		/**
		 * Checks if the given path is an invalid premium package import.
		 *
		 * @param {string} path
		 * @returns boolean
		 */
		function isInvalidPremiumImport( path ) {
			return packages.includes( premiumPackageName ) &&
				getDependencies( premiumPackageName ).includes( path ) ||
				path.startsWith( 'ckeditor5-collaboration/src/' );
		}

		function report( node, packageName ) {
			// Get the original quoting style from the source code (" or ').
			const quoteStyle = node.source.raw[ 0 ];

			return context.report( {
				node,
				messageId: 'legacyImport',
				data: {
					packageName
				},
				fix( fixer ) {
					return fixer.replaceText( node.source, quoteStyle + packageName + quoteStyle );
				}
			} );
		}

		return {
			ImportDeclaration( node ) {
				const path = node.source.value;

				if ( isInvalidCoreImport( path ) ) {
					return report( node, corePackageName );
				}

				if ( isInvalidPremiumImport( path ) ) {
					return report( node, premiumPackageName );
				}
			}
		};
	}
};
