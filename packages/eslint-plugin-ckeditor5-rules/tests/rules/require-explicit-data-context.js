/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );

const ruleTester = new RuleTester( {
	languageOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

const rule = require( '../../lib/rules/require-explicit-data-context' );

ruleTester.run( 'eslint-plugin-ckeditor5-rules/require-explicit-data-context', rule, {
	valid: [
		// Explicit context provided.
		'editor.data.parse( html, \'$documentFragment\' );',
		'editor.data.toModel( view, \'$clipboardHolder\' );',
		'this.data.parse( html, context );',
		// Destructured `data` reference with explicit context.
		'const { data } = editor; data.parse( html, \'$root\' );',
		// No arguments — out of scope (different API misuse).
		'editor.data.parse();',
		// Method not in the list.
		'editor.data.format( html );',
		// Receiver is not `data`.
		'editor.config.parse( raw );',
		'JSON.parse( raw );',
		'someOther.parse( html );',
		// Computed property access — not matched.
		'editor[ \'data\' ].parse( html );',
		// `parse` on something other than `data`.
		'parser.parse( html );',
		// Three or more arguments.
		'editor.data.parse( html, \'$documentFragment\', extra );',
		// Custom `methods` allowlist excludes `parse`.
		{
			code: 'editor.data.parse( html );',
			options: [ { methods: [ 'toModel' ] } ]
		}
	],

	invalid: [
		// Canonical case: editor.data.parse( html ) without context.
		{
			code: 'editor.data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { method: 'parse' } } ]
		},
		// editor.data.toModel( view ) without context.
		{
			code: 'editor.data.toModel( view );',
			errors: [ { messageId: 'missingContext', data: { method: 'toModel' } } ]
		},
		// `this.data.parse( html )`.
		{
			code: 'this.data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { method: 'parse' } } ]
		},
		// Destructured `data` reference.
		{
			code: 'const { data } = editor; data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { method: 'parse' } } ]
		},
		// Deep receiver chain.
		{
			code: 'foo.bar.editor.data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { method: 'parse' } } ]
		},
		// Custom `methods` includes `convert`.
		{
			code: 'editor.data.convert( view );',
			options: [ { methods: [ 'parse', 'toModel', 'convert' ] } ],
			errors: [ { messageId: 'missingContext', data: { method: 'convert' } } ]
		}
	]
} );
