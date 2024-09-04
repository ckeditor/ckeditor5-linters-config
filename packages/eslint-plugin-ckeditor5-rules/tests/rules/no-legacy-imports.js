/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'no-legacy-imports', require( '../../lib/rules/no-legacy-imports' ), {
	valid: [

		// Default options - fix all CKEditor5 imports.
		{
			code: 'import Something from "ckeditor5";'
		},
		{
			code: 'import Something from "ckeditor5-premium-features";'
		},

		// Only fix 'ckeditor5' imports.
		{
			code: 'import Something from "ckeditor5";',
			options: [ { packages: [ 'ckeditor5' ] } ]
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-ai";',
			options: [ { packages: [ 'ckeditor5' ] } ]
		},

		// Only fix 'ckeditor5-premium-features' imports.
		{
			code: 'import Something from "@ckeditor/ckeditor5-core";',
			options: [ { packages: [ 'ckeditor5-premium-features' ] } ]
		},
		{
			code: 'import Something from "ckeditor5-premium-features";',
			options: [ { packages: [ 'ckeditor5-premium-features' ] } ]
		},

		// Imports containing `/src/` are valid, as they are reported as errors by other rules.
		{
			code: 'import Something from "@ckeditor/ckeditor5-core/src/index";'
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-ai/src/index";'
		}
	],
	invalid: [

		// ckeditor5
		{
			code: 'import Something from "ckeditor5/src/core";',
			output: 'import Something from "ckeditor5";',
			errors: [
				'Import must be done from the "ckeditor5" package'
			]
		},

		{
			code: 'import Something from "ckeditor5/src/core.js";',
			output: 'import Something from "ckeditor5";',
			errors: [
				'Import must be done from the "ckeditor5" package'
			]
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-core";',
			output: 'import Something from "ckeditor5";',
			errors: [
				'Import must be done from the "ckeditor5" package'
			]
		},

		// ckeditor5-premium-features
		{
			code: 'import Something from "ckeditor5-collaboration/src/collaboration-core";',
			output: 'import Something from "ckeditor5-premium-features";',
			errors: [
				'Import must be done from the "ckeditor5-premium-features" package'
			]
		},
		{
			code: 'import Something from "ckeditor5-collaboration/src/collaboration-core.js";',
			output: 'import Something from "ckeditor5-premium-features";',
			errors: [
				'Import must be done from the "ckeditor5-premium-features" package'
			]
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-ai";',
			output: 'import Something from "ckeditor5-premium-features";',
			errors: [
				'Import must be done from the "ckeditor5-premium-features" package'
			]
		}
	]
} );
