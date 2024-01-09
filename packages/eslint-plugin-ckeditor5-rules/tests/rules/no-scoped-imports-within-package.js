/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const fixtureLoader = require( '../fixture-loader' );

const errorMessage = 'Scoped import like "@ckeditor/*" to the same package where the import declaration is located is disallowed.';
const errors = [
	{ message: errorMessage, line: 1 },
	{ message: errorMessage, line: 2 },
	{ message: errorMessage, line: 4 },
	{ message: errorMessage, line: 5 },
	{ message: errorMessage, line: 7 },
	{ message: errorMessage, line: 8 },
	{ message: errorMessage, line: 10 },
	{ message: errorMessage, line: 11 },
	{ message: errorMessage, line: 13 },
	{ message: errorMessage, line: 14 },
	{ message: errorMessage, line: 16 },
	{ message: errorMessage, line: 17 },
	{ message: errorMessage, line: 19 },
	{ message: errorMessage, line: 20 },
	{ message: errorMessage, line: 22 },
	{ message: errorMessage, line: 23 },
	{ message: errorMessage, line: 25 },
	{ message: errorMessage, line: 26 },
	{ message: errorMessage, line: 28 },
	{ message: errorMessage, line: 29 },
	{ message: errorMessage, line: 31 },
	{ message: errorMessage, line: 32 }
];

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

const fixtures = fixtureLoader( 'no-scoped-imports-within-package' );

const ruleName = 'eslint-plugin-ckeditor5-rules/no-scoped-imports-within-package';
const rule = require( '../../lib/rules/no-scoped-imports-within-package' );

ruleTester.run( ruleName, rule, {
	valid: [
		{
			code: fixtures.valid.packages.ckeditor5_feature.no_scoped_imports.content,
			filename: fixtures.valid.packages.ckeditor5_feature.no_scoped_imports.path
		},
		{
			code: fixtures.valid.packages.ckeditor5_feature.scoped_imports_not_to_self.content,
			filename: fixtures.valid.packages.ckeditor5_feature.scoped_imports_not_to_self.path
		},
		{
			code: fixtures.valid.packages.ckeditor5_feature_nested.src.a.b.c.no_scoped_imports.content,
			filename: fixtures.valid.packages.ckeditor5_feature_nested.src.a.b.c.no_scoped_imports.path
		},
		{
			code: fixtures.valid.packages.ckeditor5_feature_nested.src.a.b.c.scoped_imports_not_to_self.content,
			filename: fixtures.valid.packages.ckeditor5_feature_nested.src.a.b.c.scoped_imports_not_to_self.path
		},
		{
			code: fixtures.valid.packages.ckeditor5_invalid_pkg.scoped_imports.content,
			filename: fixtures.valid.packages.ckeditor5_invalid_pkg.scoped_imports.path
		},
		{
			code: fixtures.valid.packages.ckeditor5_missing_pkg.scoped_imports.content,
			filename: fixtures.valid.packages.ckeditor5_missing_pkg.scoped_imports.path
		}
	],

	invalid: [
		{
			code: fixtures.invalid.packages.ckeditor5_feature.scoped_imports.content,
			filename: fixtures.invalid.packages.ckeditor5_feature.scoped_imports.path,
			errors
		},
		{
			code: fixtures.invalid.packages.ckeditor5_feature_nested.src.a.b.c.scoped_imports.content,
			filename: fixtures.invalid.packages.ckeditor5_feature_nested.src.a.b.c.scoped_imports.path,
			errors
		},
		{
			code: fixtures.invalid.packages.ckeditor5_feature_short.scoped_imports.content,
			filename: fixtures.invalid.packages.ckeditor5_feature_short.scoped_imports.path,
			errors
		}
	]
} );
