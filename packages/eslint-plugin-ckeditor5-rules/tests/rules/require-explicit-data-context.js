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
		// Explicit context provided to data.parse() / data.toModel().
		'editor.data.parse( html, \'$documentFragment\' );',
		'editor.data.toModel( view, \'$clipboardHolder\' );',
		'this.data.parse( html, context );',
		// Destructured `data` reference with explicit context.
		'const { data } = editor; data.parse( html, \'$root\' );',
		// No arguments — out of scope (different API misuse, not an omitted-context bug).
		'editor.data.parse();',
		// Method not handled by this rule.
		'editor.data.format( html );',
		// Receiver is not `data`.
		'editor.config.parse( raw );',
		'JSON.parse( raw );',
		'someOther.parse( html );',
		'parser.parse( html );',
		// Computed property access — not matched.
		'editor[ \'data\' ].parse( html );',
		// Three or more arguments to parse — context is provided at index 1.
		'editor.data.parse( html, \'$documentFragment\', extra );',

		// Explicit element name provided to createRoot.
		'editor.model.document.createRoot( \'$inlineRoot\' );',
		'editor.model.document.createRoot( \'$inlineRoot\', \'main\' );',
		'this.model.document.createRoot( elementName );',
		// `createRoot` not on a `document` receiver — out of scope.
		'someUnrelated.createRoot();',

		// Explicit element name provided to writer.addRoot.
		'writer.addRoot( \'main\', \'$inlineRoot\' );',
		'writer.addRoot( rootName, elementName );',
		// `addRoot()` with no arguments — out of scope (rootName is required, this is a different bug).
		'writer.addRoot();',

		// `MultiRootEditor#addRoot( rootName, options? )` — different signature; receiver is `editor`/`this`/etc.,
		// not `writer`. Must NOT be flagged: the method resolves its own default internally.
		'editor.addRoot( \'myRoot\' );',
		'this.addRoot( rootName );',
		'multiRootEditor.addRoot( \'foo\' );',

		// Explicit context provided to upcastDispatcher.convert().
		'editor.data.upcastDispatcher.convert( viewFragment, writer, [ \'$documentFragment\' ] );',
		'this.editor.data.upcastDispatcher.convert( viewFragment, writer, root );',
		// `convert` not on an `upcastDispatcher` receiver — out of scope.
		'units.convert( value, fromUnit );'
	],

	invalid: [
		// Canonical cases for data.parse() / data.toModel().
		{
			code: 'editor.data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { label: 'data.parse()' } } ]
		},
		{
			code: 'editor.data.toModel( view );',
			errors: [ { messageId: 'missingContext', data: { label: 'data.toModel()' } } ]
		},
		{
			code: 'this.data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { label: 'data.parse()' } } ]
		},
		{
			code: 'const { data } = editor; data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { label: 'data.parse()' } } ]
		},
		{
			code: 'foo.bar.editor.data.parse( html );',
			errors: [ { messageId: 'missingContext', data: { label: 'data.parse()' } } ]
		},

		// `model.document.createRoot()` with no element name.
		{
			code: 'editor.model.document.createRoot();',
			errors: [ { messageId: 'missingContext', data: { label: 'document.createRoot()' } } ]
		},
		{
			code: 'this.model.document.createRoot();',
			errors: [ { messageId: 'missingContext', data: { label: 'document.createRoot()' } } ]
		},
		// Bare `document.createRoot()` (covers destructured `const { document } = model` patterns).
		{
			code: 'document.createRoot();',
			errors: [ { messageId: 'missingContext', data: { label: 'document.createRoot()' } } ]
		},

		// `writer.addRoot( rootName )` — element name omitted.
		{
			code: 'writer.addRoot( \'main\' );',
			errors: [ { messageId: 'missingContext', data: { label: 'writer.addRoot()' } } ]
		},
		{
			code: 'writer.addRoot( rootName );',
			errors: [ { messageId: 'missingContext', data: { label: 'writer.addRoot()' } } ]
		},

		// `upcastDispatcher.convert( viewFragment, writer )` — context omitted.
		{
			code: 'editor.data.upcastDispatcher.convert( viewFragment, writer );',
			errors: [ { messageId: 'missingContext', data: { label: 'upcastDispatcher.convert()' } } ]
		},
		{
			code: 'this.editor.data.upcastDispatcher.convert( viewFragment, writer );',
			errors: [ { messageId: 'missingContext', data: { label: 'upcastDispatcher.convert()' } } ]
		}
	]
} );
