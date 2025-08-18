/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const message = 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point.';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	languageOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

ruleTester.run(
	'allow-imports-only-from-main-package-entry-point',
	require( '../../lib/rules/allow-imports-only-from-main-package-entry-point.js' ),
	{
		valid: [
			'import Foo from \'Foo\';',
			'import Foo from \'ckeditor5-foo/bar/baz.js\';',
			'import { Table } from \'@ckeditor/ckeditor5-table\';',
			'import { Helper } from \'@ckeditor/ckeditor5-core/tests/_utils/helper.js\';',
			'import { Helper } from \'@ckeditor/ckeditor5-core/tests/manual/_utils/helper.js\';',
			'import { Helper } from \'@ckeditor/ckeditor5-core/tests/feature/_utils/helper.js\';'
		],
		invalid: [
			// Do not allow importing from the `src` folder.
			{
				code: 'import Table from "@ckeditor/ckeditor5-table/src/table";',
				output: 'import { Table } from \'@ckeditor/ckeditor5-table\';',
				errors: [ { message } ]
			},
			// Do not allow importing icons from the `theme` folder.
			{
				code: 'import icon from "@ckeditor/ckeditor5-table/theme/icons/icon.svg";',
				output: 'import { icon } from \'@ckeditor/ckeditor5-table\';',
				errors: [ { message } ]
			},
			// Do not allow importing style sheets from the `theme` folder.
			{
				code: 'import styles from "@ckeditor/ckeditor5-table/theme/styles.css";',
				output: 'import { styles } from \'@ckeditor/ckeditor5-table\';',
				errors: [ { message } ]
			},
			// Do not fix if there are both default and named imports.
			{
				code: 'import Foo, { Bar } from "@ckeditor/ckeditor5-core/src/core";',
				errors: [ { message } ]
			}
		]
	}
);
