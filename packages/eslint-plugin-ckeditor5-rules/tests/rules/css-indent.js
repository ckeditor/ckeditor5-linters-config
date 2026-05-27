/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/css-indent';
const rule = require( '../../lib/rules/css-indent' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const leadingSpaceError = { messageId: 'leadingSpace' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			// An empty file.
			code: ''
		},
		{
			// Single-line rule with no indentation.
			code: '.foo { color: hsl(0, 0%, 0%); }\n'
		},
		{
			// Tab-indented declaration.
			code: '.foo {\n\tcolor: hsl(0, 0%, 0%);\n}\n'
		},
		{
			// Nested tab-indented rule.
			code: '.foo {\n\t& .bar {\n\t\tcolor: hsl(0, 0%, 0%);\n\t}\n}\n'
		},
		{
			// Tab followed by spaces - continuation alignment inside a comment is allowed.
			code: '.foo {\n\t/* First line.\n\t   Continuation aligned with spaces. */\n\tcolor: hsl(0, 0%, 0%);\n}\n'
		},
		{
			// Blank lines (whitespace-only) are ignored.
			code: '.foo {\n\tcolor: hsl(0, 0%, 0%);\n\n\tbackground: hsl(0, 0%, 100%);\n}\n'
		},
		{
			// License-header style block comment - continuation lines start with ` *`.
			code: [
				'/*',
				' * Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */',
				'',
				'.foo {',
				'\tcolor: hsl(0, 0%, 0%);',
				'}',
				''
			].join( '\n' )
		}
	],

	invalid: [
		{
			// Two-space indent on a declaration.
			code: '.foo {\n  color: hsl(0, 0%, 0%);\n}\n',
			errors: [ leadingSpaceError ]
		},
		{
			// Four-space indent on a declaration.
			code: '.foo {\n    color: hsl(0, 0%, 0%);\n}\n',
			errors: [ leadingSpaceError ]
		},
		{
			// Space-indented nested rule.
			code: '.foo {\n  & .bar {\n    color: hsl(0, 0%, 0%);\n  }\n}\n',
			errors: [
				leadingSpaceError,
				leadingSpaceError,
				leadingSpaceError
			]
		},
		{
			// Single leading space.
			code: '.foo {\n color: hsl(0, 0%, 0%);\n}\n',
			errors: [ leadingSpaceError ]
		}
	]
} );
