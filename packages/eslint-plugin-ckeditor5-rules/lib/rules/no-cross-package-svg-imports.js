/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { extname, sep } = require( 'upath' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow direct imports of SVG icons from other packages',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#importing-svg-files-from-other-packages-ckeditor5-rulesno-cross-package-svg-imports'
		}
	},
	create( context ) {
		return {
			ImportDeclaration( node ) {
				const url = node.source.value;

				if ( extname( url ) !== '.svg' ) {
					return;
				}

				// Turn `../theme/icons/check.svg` into `[ '..', 'theme', 'icons', 'check.svg' ]`.
				const parts = url.split( sep );

				// Get index of the part of the URL containing `theme`.
				const themeIndex = parts.findIndex( part => part === 'theme' );

				/**
				 * Check if `theme` index was found and if the previous part of the URL is `..`. This is done to
				 * prevent working around this rule by replacing `OTHER_PACKAGE/theme/icons/icon.svg` to
				 * equivalent but relative path like `../../OTHER_PACKAGE/theme/icons/icon.svg`.
				 *
				 * Correct import from within the same package:
				 * - `../theme/icons/icon.svg`.
				 *
				 * Incorrect imports from other packages:
				 * - `OTHER_PACKAGE/theme/icons/icon.svg`.
				 * - `../../../OTHER_PACKAGE/theme/icons/icon.svg`.
				 * - `../../../../../nod_modules/OTHER_PACKAGE/theme/icons/icon.svg`.
				 */
				if ( themeIndex >= 0 && parts[ themeIndex - 1 ] === ( '..' ) ) {
					return;
				}

				context.report( {
					node,
					// eslint-disable-next-line max-len
					message: 'Icons can only be imported from package\'s own `theme` folder or by importing it from other package main entrypoint.'
				} );
			}
		};
	}
};
