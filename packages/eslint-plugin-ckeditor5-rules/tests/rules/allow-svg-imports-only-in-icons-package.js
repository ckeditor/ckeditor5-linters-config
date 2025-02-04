/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run(
	'allow-declare-module-only-in-augmentation-file',
	require( '../../lib/rules/allow-svg-imports-only-in-icons-package' ),
	{
		valid: [
			{
				code: 'import Icon from \'./icon.svg\';',
				filename: '/some/docs/path/file.js'
			},
			{
				code: 'export { default as Icon } from \'./icon.svg\';',
				filename: '/packages/ckeditor5-icons/src/index.ts'
			}
		],
		invalid: [
			{
				code: 'import Icon from \'./icon.svg\';',
				filename: '/some/path/src/invalid.ts',
				errors: [
					{
						message: 'SVG imports are only allowed in docs and the `@ckeditor/ckeditor5-icons` package.'
					}
				]
			},
			{
				code: 'export { default as Icon } from \'./icon.svg\';',
				filename: '/some/path/src/invalid.ts',
				errors: [
					{
						message: 'SVG imports are only allowed in docs and the `@ckeditor/ckeditor5-icons` package.'
					}
				]
			}
		]
	}
);
