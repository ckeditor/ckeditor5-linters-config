/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
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

ruleTester.run( 'no-default-export', require( '../../lib/rules/no-default-export' ), {
	valid: [
		{
			code: 'export const foo = 42;'
		},
		{
			code: 'export function bar() {}'
		},
		{
			code: 'const baz = 100; export { baz };'
		},
		{
			code: 'import something from \'./source.js\'; export { something };'
		},
		{
			code: 'export { namedExport } from \'./source.js\';'
		},
		{
			code: 'export { default as namedExport } from \'./source.js\';'
		},
		{
			code: 'export type { default as Foo } from \'./source.js\';'
		}
	],

	invalid: [
		{
			code: 'export default function foo() {}',
			errors: [
				'Default exports are disallowed. Use a named export instead.'
			]
		},
		{
			code: 'const foo = 42; export default foo;',
			errors: [
				'Default exports are disallowed. Use a named export instead.'
			]
		},
		{
			code: 'const foo = 42; export { foo as default };',
			errors: [
				'Default exports are disallowed. Use a named export instead.'
			]
		},
		{
			code: 'export { default } from \'./source.js\';',
			errors: [
				'Default exports are disallowed. Use a named export instead.'
			]
		}
	]
} );
