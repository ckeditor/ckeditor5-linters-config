/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const parser = require( '@typescript-eslint/parser' );

const ruleTester = new RuleTester( {
	languageOptions: {
		parser
	}
} );

ruleTester.run(
	'allow-declare-module-only-in-augmentation-file',
	require( '../../lib/rules/allow-svg-imports-only-in-icons-package' ),
	{
		valid: [
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
						message: 'SVG imports are only allowed in the `@ckeditor/ckeditor5-icons` package.'
					}
				]
			},
			{
				code: 'export { default as Icon } from \'./icon.svg\';',
				filename: '/some/path/src/invalid.ts',
				errors: [
					{
						message: 'SVG imports are only allowed in the `@ckeditor/ckeditor5-icons` package.'
					}
				]
			}
		]
	}
);
