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
			code: 'import Something from "library";'
		},
		{
			code: 'import Something from "@scoped/library";'
		},
		{
			code: 'import Something from "fs";'
		},
		{
			code: 'import Something from "node:fs";'
		},

		// Export all
		{
			code: 'export * as Something from "/absolute/path/with/file.extension";'
		},
		{
			code: 'export * as Something from "./relative/path/with/file.extension";'
		},
		{
			code: 'export * as Something from "library";'
		},
		{
			code: 'export * as Something from "@scoped/library";'
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
			code: 'export { Something } from "library";'
		},
		{
			code: 'export { Something } from "@scoped/library";'
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
			code: 'import Something from "library/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "library/path/without/file/extension"'
			]
		},
		{
			code: 'import Something from "@scoped/library/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "@scoped/library/path/without/file/extension"'
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
		{
			code: 'export * as Something from "library/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "library/path/without/file/extension"'
			]
		},
		{
			code: 'export * as Something from "@scoped/library/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "@scoped/library/path/without/file/extension"'
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
		{
			code: 'export { Something } from "library/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "library/path/without/file/extension"'
			]
		},
		{
			code: 'export { Something } from "@scoped/library/path/without/file/extension";',
			errors: [
				'Missing file extension in import/export "@scoped/library/path/without/file/extension"'
			]
		}
	]
} );
