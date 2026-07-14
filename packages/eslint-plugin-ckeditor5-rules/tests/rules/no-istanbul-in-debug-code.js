/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	languageOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

const error = { message: 'Comments cannot have both `@if CK_DEBUG_*` and `istanbul` keywords in the same line.' };

ruleTester.run( 'eslint-plugin-ckeditor5-rules/no-istanbul-in-debug-code', require( '../../lib/rules/no-istanbul-in-debug-code' ), {
	valid: [
		{
			code: 'foo();'
		},
		{
			code: '// @if CK_DEBUG // foo();'
		},
		{
			name: 'Istanbul ignore comment in regular, non-debug code',
			code: `
				/* istanbul ignore next -- @preserve */
				foo();
			`
		}
	],

	// -----------------------------------------------------------------------------------------------------

	invalid: [
		{
			name: 'Istanbul ignore comment in a `@if CK_DEBUG` line',
			code: `
				// @if CK_DEBUG //	/* istanbul ignore next -- @preserve */
				// @if CK_DEBUG //	if ( condition ) {
				// @if CK_DEBUG //		statement;
				// @if CK_DEBUG //	}
			`,
			errors: [ error ]
		},
		{
			name: 'Istanbul ignore comment in a `@if CK_DEBUG_TABLE` line',
			code: `
				// @if CK_DEBUG_TABLE //	/* istanbul ignore next -- @preserve */
				// @if CK_DEBUG_TABLE //	if ( condition ) {
				// @if CK_DEBUG_TABLE //		statement;
				// @if CK_DEBUG_TABLE //	}
			`,
			errors: [ error ]
		}
	]
} );
