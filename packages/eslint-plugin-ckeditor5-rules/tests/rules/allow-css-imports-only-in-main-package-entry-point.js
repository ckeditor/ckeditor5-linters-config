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

const message = 'CSS imports are only allowed in the main package entry point (`src/index.ts`).';

ruleTester.run(
	'allow-css-imports-only-in-main-package-entry-point',
	require( '../../lib/rules/allow-css-imports-only-in-main-package-entry-point' ),
	{
		valid: [
			{
				code: 'import \'../theme/index.css\';',
				filename: '/packages/ckeditor5-example/src/index.ts'
			},
			{
				code: 'import \'@example/other-package/styles.min.css\';',
				filename: '/packages/ckeditor5-example/src/index.ts'
			},
			{
				code: 'import \'../theme/index.css\';',
				filename: 'C:\\packages\\ckeditor5-example\\src\\index.ts'
			},
			{
				code: 'import { Example } from \'./example.js\';',
				filename: '/packages/ckeditor5-example/src/example.ts'
			}
		],
		invalid: [
			{
				code: 'import \'../theme/example.css\';',
				filename: '/packages/ckeditor5-example/src/example.ts',
				errors: [ { message } ]
			},
			{
				code: 'import styles from \'./example.css\';',
				filename: '/packages/ckeditor5-example/src/example.ts',
				errors: [ { message } ]
			},
			{
				code: 'export * from \'./example.css\';',
				filename: '/packages/ckeditor5-example/src/example.ts',
				errors: [ { message } ]
			},
			{
				code: 'import \'../../theme/index.css\';',
				filename: '/packages/ckeditor5-example/src/utils/index.ts',
				errors: [ { message } ]
			}
		]
	}
);
