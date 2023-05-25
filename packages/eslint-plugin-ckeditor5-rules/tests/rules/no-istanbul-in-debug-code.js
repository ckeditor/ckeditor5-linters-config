/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018
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
			code: `
				/* istanbul ignore next -- @preserve */
				foo();
			`
		}
	],

	// -----------------------------------------------------------------------------------------------------

	invalid: [
		{
			code: `
				// @if CK_DEBUG //	/* istanbul ignore next -- @preserve */
				// @if CK_DEBUG //	if ( condition ) {
				// @if CK_DEBUG //		statement;
				// @if CK_DEBUG //	}
			`,
			errors: [ error ]
		},
		{
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
