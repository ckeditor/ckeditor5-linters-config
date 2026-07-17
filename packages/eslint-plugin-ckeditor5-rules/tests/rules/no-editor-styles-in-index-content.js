/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/no-editor-styles-in-index-content';
const rule = require( '../../lib/rules/no-editor-styles-in-index-content' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const filename = '/packages/ckeditor5-example/theme/index-content.css';
const editorStyleError = { messageId: 'editorStyleInIndexContent' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			code: '',
			filename
		},
		{
			code: '.ck-content { color: inherit; }',
			filename
		},
		{
			code: '.foo.ck-content:hover > p { color: inherit; }',
			filename
		},
		{
			code: '[dir="rtl"] .ck-content > p { color: inherit; }',
			filename
		},
		{
			code: '.ck-content:is(.foo, .bar) { color: inherit; }',
			filename
		},
		{
			code: '.ck-content p:not(.ck-editor__editable) { color: inherit; }',
			filename
		},
		{
			code: '.ck-content { & .child { color: inherit; } }',
			filename
		},
		{
			code: '@media (min-width: 10px) { .ck-content p { color: inherit; } }',
			filename
		},
		{
			code: ':root { --ck-content-font-family: sans-serif; }',
			filename
		},
		{
			code: '@font-face { font-family: Example; src: url(example.woff2); }',
			filename
		},
		{
			code: '@keyframes ck-fade { from { opacity: 0; } 50% { opacity: .5; } to { opacity: 1; } }',
			filename
		},
		{
			code: '.ck-button { display: block; }',
			filename: '/packages/ckeditor5-example/theme/index-editor.css'
		},
		{
			code: '.ck-button { display: block; }',
			filename: 'C:\\packages\\ckeditor5-example\\theme\\index-editor.css'
		}
	],

	invalid: [
		{
			code: '.ck-button { display: block; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: '.ck-editor__editable.ck-content p { margin: 0; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: '.ck.ck-pagination_enabled.ck-content p { margin: 0; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: '.ck-editor .ck-content p, .wrapper .ck-content p { margin: 0; }',
			filename,
			errors: [ editorStyleError, editorStyleError ]
		},
		{
			code: '.ck-content .ck-editor__nested-editable { margin: 0; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: '.ck-content :is(p, .ck-editor__editable) { color: inherit; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: ':not(.ck-content), .widget:not(.ck-content) { display: block; }',
			filename,
			errors: [ editorStyleError, editorStyleError ]
		},
		{
			code: '.ck-button, .ck-content { color: inherit; }',
			filename,
			errors: [ { ...editorStyleError, line: 1, column: 1 } ]
		},
		{
			code: ':is(.ck-content, .ck-button) { color: inherit; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: ':where(.ck-content, .ck-editor__editable.ck-content) { color: inherit; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: '@supports (display: grid) { .ck-button { display: grid; } }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: ':root { .ck-button { display: block; } }',
			filename,
			errors: [ { ...editorStyleError, line: 1, column: 9 } ]
		},
		{
			code: ':root { color: inherit; }',
			filename,
			errors: [ editorStyleError ]
		},
		{
			code: '.wrapper { .ck-content &, & .ck-content { color: inherit; } }',
			filename,
			errors: [
				{ ...editorStyleError, line: 1, column: 1 },
				{ ...editorStyleError, line: 1, column: 27 }
			]
		},
		{
			code: '.ck-content, .ck-editor { & .child { color: inherit; } }',
			filename,
			errors: [
				{ ...editorStyleError, line: 1, column: 14 },
				{ ...editorStyleError, line: 1, column: 27 }
			]
		}
	]
} );
