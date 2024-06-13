/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
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
			// Do not allow importing from the `src` folder.
			{
				code: 'import Table from "@ckeditor/ckeditor5-table/src/table";',
				errors: [
					{
						message: 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point.'
					}
				]
			},
			// Do not allow importing from icons the `theme` folder.
			{
				code: 'import icon from "@ckeditor/ckeditor5-table/theme/icons/icon.svg";',
				errors: [
					{
						message: 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point.'
					}
				]
			},
			// Do not allow importing style sheets from the `theme` folder.
			{
				code: 'import styles from "@ckeditor/ckeditor5-table/theme/styles.css";',
				errors: [
					{
						message: 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point.'
					}
				]
			}
		]
	}
);
