/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'require-file-extensions-in-imports', require( '../../lib/rules/require-file-extensions-in-imports' ), {
	valid: [

		// Import
		{
			code: 'import Something from "/absolute/path/with/file.extension";'
		},
		{
			code: 'import Something from "./relative/path/with/file.extension";'
		},
		{
			code: 'import Something from "fs";'
		},
		{
			code: 'import Something from "node:fs";'
		},

		// Import external dependency
		{
			code: 'import Something from "enhanced-resolve";' // Unscoped
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-dev-utils";' // Scoped
		},

		// Import from external dependency that uses "exports" field
		{
			code: 'import tokenizer from "postcss/lib/tokenize";'
		},

		// Export all
		{
			code: 'export * as Something from "/absolute/path/with/file.extension";'
		},
		{
			code: 'export * as Something from "./relative/path/with/file.extension";'
		},
		{
			code: 'export * as Something from "enhanced-resolve";'
		},
		{
			code: 'export * as Something from "@ckeditor/ckeditor5-dev-utils";'
		},
		{
			code: 'export * as Something from "fs";'
		},
		{
			code: 'export * as Something from "node:fs";'
		},

		// Named export
		{
			code: 'export { Something } from "/absolute/path/with/file.extension";'
		},
		{
			code: 'export { Something } from "./relative/path/with/file.extension";'
		},
		{
			code: 'export { Something } from "enhanced-resolve";'
		},
		{
			code: 'export { Something } from "@ckeditor/ckeditor5-dev-utils";'
		},
		{
			code: 'export { Something } from "fs";'
		},
		{
			code: 'export { Something } from "node:fs";'
		}
	],
	invalid: [

		// Import
		{
			code: 'import Something from "/absolute/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "/absolute/path/without/file/extension"'
			]
		},
		{
			code: 'import Something from "./relative/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "./relative/path/without/file/extension"'
			]
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-dev-utils/lib/index";',
			errors: [
				'Missing file extension in import/export "@ckeditor/ckeditor5-dev-utils/lib/index"'
			]
		},
		{
			code: 'import Something from ".";',
			output: 'import Something from "./lib/index.js";',
			errors: [
				'Missing file extension in import/export "."'
			]
		},

		// Export all
		{
			code: 'export * as Something from "/absolute/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "/absolute/path/without/file/extension"'
			]
		},
		{
			code: 'export * as Something from "./relative/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "./relative/path/without/file/extension"'
			]
		},

		// Export all from external library without file extension.
		{
			code: 'export * as Something from "enhanced-resolve/lib/index";',
			errors: [
				'Missing file extension in import/export "enhanced-resolve/lib/index"'
			]
		},
		{
			code: 'export * as Something from "@ckeditor/ckeditor5-dev-utils/lib/index";',
			errors: [
				'Missing file extension in import/export "@ckeditor/ckeditor5-dev-utils/lib/index"'
			]
		},

		// Named export
		{
			code: 'export { Something } from "/absolute/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "/absolute/path/without/file/extension"'
			]
		},
		{
			code: 'export { Something } from "./relative/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "./relative/path/without/file/extension"'
			]
		},

		// Named export from external library without file extension.
		{
			code: 'export { ResolverFactory } from "enhanced-resolve/lib/index";',
			errors: [
				'Missing file extension in import/export "enhanced-resolve/lib/index"'
			]
		},
		{
			code: 'export { git } from "@ckeditor/ckeditor5-dev-utils/lib/index";',
			errors: [
				'Missing file extension in import/export "@ckeditor/ckeditor5-dev-utils/lib/index"'
			]
		}
	]
} );
