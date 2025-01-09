/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'require-as-const-returns-in-methods', require( '../../lib/rules/require-as-const-returns-in-methods' ), {
	valid: [
		{
			code: `
				class Test {
					public test() {
						return 123;
					}
				}
			`,
			filename: '/some/path/src/augmentation.ts',
			options: [
				{ methodNames: [] }
			]
		},
		{
			code: `
				class Test {
					public test() {
						return 123 as const;
					}
				}
			`,
			filename: '/some/path/src/augmentation.ts',
			options: [
				{ methodNames: [ 'test' ] }
			]
		}
	],
	invalid: [
		{
			code: `
				class Test {
					public test() {
						return 123;
					}
				}
			`,
			filename: '/some/path/src/augmentation.ts',
			options: [
				{ methodNames: [ 'test' ] }
			],
			errors: [
				{
					message: 'Not all return statements end with "as const".'
				}
			]
		},

		{
			code: `
				class Test {
					public test(): string {
						return 123 as const;
					}
				}
			`,
			filename: '/some/path/src/augmentation.ts',
			options: [
				{ methodNames: [ 'test' ] }
			],
			errors: [
				{
					message: 'Methods that require return statements to end with "as const" cannot specify a return type.'
				}
			]
		}
	]
} );
