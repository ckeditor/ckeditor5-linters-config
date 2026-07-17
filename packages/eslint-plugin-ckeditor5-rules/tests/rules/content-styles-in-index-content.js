/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/content-styles-in-index-content';
const rule = require( '../../lib/rules/content-styles-in-index-content' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const filename = '/packages/ckeditor5-example/theme/example.css';
const indexContentFilename = '/packages/ckeditor5-example/theme/index-content.css';
const contentStyleError = { messageId: 'contentStyleOutsideIndexContent' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			code: '',
			filename
		},
		{
			code: '.ck-button { display: block; }',
			filename
		},
		{
			code: '.ck-editor__editable.ck-content p { margin: 0; }',
			filename
		},
		{
			code: '.ck.ck-pagination_enabled.ck-content p { margin: 0; }',
			filename
		},
		{
			code: '.ck-editor .ck-content p { margin: 0; }',
			filename
		},
		{
			code: '.ck-content .ck-editor__nested-editable { margin: 0; }',
			filename
		},
		{
			code: '.wrapper .ck-content p { margin: 0; }',
			filename
		},
		{
			code: ':not(.ck-content), .widget:not(.ck-content) { display: block; }',
			filename
		},
		{
			code: ':has(> .ck-content) { display: block; }',
			filename
		},
		{
			code: '.wrapper { & .ck-content { color: inherit; } }',
			filename
		},
		{
			code: '.wrapper { .ck-content { color: inherit; } }',
			filename
		},
		{
			code: '@keyframes ck-fade { from { opacity: 0; } to { opacity: 1; } }',
			filename
		},
		{
			code: '.ck-content, .ck-button { color: inherit; }',
			filename: indexContentFilename
		},
		{
			code: '.ck-content { color: inherit; }',
			filename: 'C:\\packages\\ckeditor5-example\\theme\\index-content.css'
		}
	],

	invalid: [
		{
			code: '.ck-content p:not(.ck-editor__editable) { color: inherit; }',
			filename,
			errors: [ contentStyleError ]
		},
		{
			code: '.ck-content { color: inherit; }',
			filename,
			errors: [ contentStyleError ]
		},
		{
			code: '.ck-content p, .foo.ck-content:hover { color: inherit; }',
			filename,
			errors: [ contentStyleError, contentStyleError ]
		},
		{
			code: '[dir="rtl"] .ck-content p { color: inherit; }',
			filename,
			errors: [ contentStyleError ]
		},
		{
			code: '.ck-button, .ck-content { color: inherit; }',
			filename,
			errors: [ { ...contentStyleError, line: 1, column: 13 } ]
		},
		{
			code: ':is(.ck-content, .ck-button) { color: inherit; }',
			filename,
			errors: [ contentStyleError ]
		},
		{
			code: '.ck-content:is(.foo, .bar) { color: inherit; }',
			filename,
			errors: [ contentStyleError ]
		},
		{
			code: '@media (min-width: 10px) { .ck-content { color: inherit; } }',
			filename,
			errors: [ contentStyleError ]
		},
		{
			code: '.ck-content { & .child { color: inherit; } }',
			filename,
			errors: [ contentStyleError, contentStyleError ]
		},
		{
			code: '.wrapper { .ck-content &, & .ck-content { color: inherit; } }',
			filename,
			errors: [ { ...contentStyleError, line: 1, column: 12 } ]
		},
		{
			code: '.ck-content, .ck-editor { & .child { color: inherit; } }',
			filename,
			errors: [
				{ ...contentStyleError, line: 1, column: 1 },
				{ ...contentStyleError, line: 1, column: 27 }
			]
		},
		{
			code: '.ck-content:not(.ck-editor__editable) { color: inherit; }',
			filename,
			errors: [ contentStyleError ]
		}
	]
} );
