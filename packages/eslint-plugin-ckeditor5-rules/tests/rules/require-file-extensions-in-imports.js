/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'require-file-extensions-in-imports', require( '../../lib/rules/require-file-extensions-in-imports' ), {
	valid: [
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
		}
	],
	invalid: [
		{
			code: 'import Something from "/absolute/path/without/file/extension";',
			errors: [
				'Missing file extension in import "/absolute/path/without/file/extension"'
			]
		},
		{
			code: 'import Something from "./relative/path/without/file/extension";',
			errors: [
				'Missing file extension in import "./relative/path/without/file/extension"'
			]
		},
		{
			code: 'import Something from "library/path/without/file/extension";',
			errors: [
				'Missing file extension in import "library/path/without/file/extension"'
			]
		},
		{
			code: 'import Something from "@scoped/library/path/without/file/extension";',
			errors: [
				'Missing file extension in import "@scoped/library/path/without/file/extension"'
			]
		}
	]
} );
