/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run(
	'allow-declare-module-only-in-augmentation-file',
	require( '../lib/rules/allow-declare-module-only-in-augmentation-file' ),
	{
		valid: [
			{
				code: 'declare module "@ckeditor/ckeditor5-core" {}',
				filename: '/some/path/src/augmentation.ts'
			}
		],
		invalid: [
			{
				code: 'declare module "@ckeditor/ckeditor5-core" {}',
				filename: '/some/path/src/invalid.ts',
				errors: [
					{
						// eslint-disable-next-line max-len
						message: 'Module augmentation for the "@ckeditor/ckeditor5-core" package is only allowed in "src/augmentation.ts" files.'
					}
				]
			}
		]
	}
);
