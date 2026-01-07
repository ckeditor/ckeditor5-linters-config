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
	require( '../../lib/rules/allow-declare-module-only-in-augmentation-file' ),
	{
		valid: [
			{
				code: 'declare module "@ckeditor/ckeditor5-core" {}',
				filename: '/some/path/src/augmentation.ts'
			},
			{
				code: 'declare module "@ckeditor/ckeditor5-core" {}',
				filename: 'C:\\some\\path\\src\\augmentation.ts'
			}
		],
		invalid: [
			{
				code: 'declare module "@ckeditor/ckeditor5-core" {}',
				filename: '/some/path/src/invalid.ts',
				errors: [
					{
						// eslint-disable-next-line @stylistic/max-len
						message: 'Module augmentation for the "@ckeditor/ckeditor5-core" package is only allowed in "src/augmentation.ts" files.'
					}
				]
			}
		]
	}
);
