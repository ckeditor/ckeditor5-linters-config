/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

// Match the following:
//
// * import * from 'ckeditor5/...';
// * import * from '@ckeditor/ckeditor5-...';
const CKEDITOR5_IMPORT_REGEXP = /^((@ckeditor\/)?ckeditor5-?)/;

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow imports from CKEditor 5 in specified packages.',
			category: 'CKEditor5',
			// eslint-disable-next-line @stylistic/max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#cross-package-imports-ckeditor5-rulesno-cross-package-imports'
		},
		schema: []
	},
	create( context ) {
		const disallowedPackages = getDisallowedPackages( context );

		return {
			ImportDeclaration: node => {
				if ( node.importKind === 'type' ) {
					return;
				}

				// Find the name of the current processed package.
				const processedPackage = context.filename.replace( context.cwd, '' );

				// Check whether the package can import from CKEditor 5.
				const shouldCheckPackage = disallowedPackages.some( pack => processedPackage.includes( pack ) );

				if ( !shouldCheckPackage ) {
					return;
				}

				// If so, verify whether imported path imports a module from CKEditor 5.
				if ( CKEDITOR5_IMPORT_REGEXP.test( node.source.value ) ) {
					context.report( {
						node,
						message: 'This package cannot import CKEditor 5 packages.'
					} );
				}
			}
		};
	}
};

/**
 * @param {Object} context
 * @param {Object} [context.settings]
 * @param {Array} [context.settings.disallowedCrossImportsPackages]
 * @return {Array.<String>}
 */
function getDisallowedPackages( context ) {
	if ( !context.settings ) {
		return [];
	}

	return context.settings.disallowedCrossImportsPackages || [];
}
