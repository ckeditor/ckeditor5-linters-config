/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const parser = require( '@typescript-eslint/parser' );

const errorMessage = 'The TypeScript "enum" keyword is disallowed. Use a const object or union types instead.';

const ruleTester = new RuleTester( {
	languageOptions: {
		parser
	}
} );

ruleTester.run( 'no-enum', require( '../../lib/rules/no-enum' ), {
	valid: [
		{
			code: `
				const Colors = {
					red: 'red',
					blue: 'blue'
				} as const;

				type Color = typeof Colors[ keyof typeof Colors ];
			`
		},
		{
			code: 'type State = \'ready\' | \'busy\';'
		}
	],
	invalid: [
		{
			code: `
				enum Color {
					Red = 'red',
					Blue = 'blue'
				}
			`,
			errors: [
				{
					message: errorMessage
				}
			]
		},
		{
			code: `
				const enum Permission {
					Read = 1,
					Write = 2
				}
			`,
			errors: [
				{
					message: errorMessage
				}
			]
		},
		{
			code: `
				declare enum Status {
					Ready,
					Busy
				}
			`,
			errors: [
				{
					message: errorMessage
				}
			]
		}
	]
} );
