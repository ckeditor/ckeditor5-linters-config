/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parserOptions: { sourceType: 'module', ecmaVersion: 2020 }
} );

ruleTester.run(
	'allow-imports-only-from-main-package-entry-point',
	require( '../../lib/rules/allow-imports-only-from-main-package-entry-point.js' ),
	{
		valid: [
			'import { Table } from "@ckeditor/ckeditor5-table";'
		],
		invalid: [
			{
				code: 'import Table from "@ckeditor/ckeditor5-table/src/table";',
				errors: [
					{
						// eslint-disable-next-line max-len
						message: 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point, not from their "/src" folder.'
					}
				]
			}
		]
	}
);
