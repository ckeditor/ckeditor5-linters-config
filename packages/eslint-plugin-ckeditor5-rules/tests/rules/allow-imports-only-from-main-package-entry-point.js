/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'node:fs' );
const os = require( 'node:os' );
const path = require( 'node:path' );

const message = 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point.';
const fixtureDirectory = fs.mkdtempSync( path.join( os.tmpdir(), 'allow-imports-only-from-main-package-entry-point-' ) );

createPackageJson( '@ckeditor/ckeditor5-exported-package', {
	name: '@ckeditor/ckeditor5-exported-package',
	exports: {
		'./feature': {
			types: './dist/feature/index.d.ts',
			import: './dist/feature.js'
		},
		'./utils': {
			types: './dist/utils/index.d.ts',
			import: './dist/utils.js'
		}
	}
} );

createPackageJson( '@ckeditor/ckeditor5-wildcard-package', {
	name: '@ckeditor/ckeditor5-wildcard-package',
	exports: {
		'./*': './*'
	}
} );

createPackageJson( '@ckeditor/ckeditor5-no-exports-package', {
	name: '@ckeditor/ckeditor5-no-exports-package'
} );

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
			{
				code: 'import { ExportedFeature } from \'@ckeditor/ckeditor5-exported-package/feature\';',
				filename: path.join( fixtureDirectory, 'input.js' )
			},
			{
				code: 'import { WildcardFeature } from \'@ckeditor/ckeditor5-wildcard-package/src/feature\';',
				filename: path.join( fixtureDirectory, 'input.js' )
			},
			'import { Helper } from \'@ckeditor/ckeditor5-core/tests/_utils/helper.js\';',
			'import { Helper } from \'@ckeditor/ckeditor5-core/tests/manual/_utils/helper.js\';',
			'import { Helper } from \'@ckeditor/ckeditor5-core/tests/feature/_utils/helper.js\';',
			'import { Helper } from \'@ckeditor/ckeditor5-core/tests/feature/_utils-tests/helper.js\';'
		],
		invalid: [
			// Do not allow importing from a package without the `exports` field.
			{
				code: 'import NoExportsFeature from "@ckeditor/ckeditor5-no-exports-package/src/feature";',
				output: 'import { NoExportsFeature } from \'@ckeditor/ckeditor5-no-exports-package\';',
				filename: path.join( fixtureDirectory, 'input.js' ),
				errors: [ { message } ]
			},
			// Do not allow importing icons from a package without the `exports` field.
			{
				code: 'import icon from "@ckeditor/ckeditor5-no-exports-package/theme/icons/icon.svg";',
				output: 'import { icon } from \'@ckeditor/ckeditor5-no-exports-package\';',
				filename: path.join( fixtureDirectory, 'input.js' ),
				errors: [ { message } ]
			},
			// Do not allow importing style sheets from a package without the `exports` field.
			{
				code: 'import styles from "@ckeditor/ckeditor5-no-exports-package/theme/styles.css";',
				output: 'import { styles } from \'@ckeditor/ckeditor5-no-exports-package\';',
				filename: path.join( fixtureDirectory, 'input.js' ),
				errors: [ { message } ]
			},
			// Do not fix if there are both default and named imports.
			{
				code: 'import Foo, { Bar } from "@ckeditor/ckeditor5-no-exports-package/src/core";',
				filename: path.join( fixtureDirectory, 'input.js' ),
				errors: [ { message } ]
			},
			// Do not allow importing from package subpaths not listed in the `exports` field.
			{
				code: 'import ExportedFeature from "@ckeditor/ckeditor5-exported-package/dist/feature.js";',
				output: 'import { ExportedFeature } from \'@ckeditor/ckeditor5-exported-package\';',
				filename: path.join( fixtureDirectory, 'input.js' ),
				errors: [ { message } ]
			}
		]
	}
);

function createPackageJson( packageName, packageJson ) {
	const packageDirectory = path.join( fixtureDirectory, 'node_modules', packageName );

	fs.mkdirSync( packageDirectory, { recursive: true } );
	fs.writeFileSync( path.join( packageDirectory, 'package.json' ), JSON.stringify( packageJson, null, '\t' ) );
}
