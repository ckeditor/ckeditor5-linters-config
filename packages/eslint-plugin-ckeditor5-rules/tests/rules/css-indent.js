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

const incorrectIndent = { messageId: 'incorrectIndent' };

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
			// @media-wrapped rule: depth 1 for the rule, depth 2 for the declaration.
			code: '@media (min-width: 100px) {\n\t.foo {\n\t\tcolor: hsl(0, 0%, 0%);\n\t}\n}\n'
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
			// Multi-line declaration value (linear-gradient args). Continuation lines
			// inside the parens get exactly one extra tab.
			code: '.foo {\n\tbackground: linear-gradient(\n\t\tto right,\n\t\thsl(0, 0%, 0%),\n\t\thsl(0, 0%, 100%)\n\t);\n}\n'
		},
		{
			// Multi-line selector with a multi-line :not() function. Continuation lines
			// inside :not() parens are at outer + 1.
			code: '.outer {\n\t&.ck-foo *:not(\n\t\t.a,\n\t\t.b,\n\t\t.c\n\t) {\n\t\tcolor: hsl(0, 0%, 0%);\n\t}\n}\n'
		},
		{
			// Nested multi-line functions: each level adds one extra tab.
			code: '.foo {\n\tbackground: outer(\n\t\tinner(\n\t\t\thsl(0, 0%, 0%)\n\t\t)\n\t);\n}\n'
		},
		{
			// Custom-property values (`--foo: …`) parse as a Raw blob, so their
			// continuation lines are skipped - the rule has no AST to anchor an
			// expected indent on inside an opaque value.
			code: ':root {\n\t--foo: linear-gradient(\n\t\twhite,\n\t\tblack\n\t);\n}\n'
		},
		{
			// `@starting-style { & { ... } }` is parsed as a `Raw` blob in tolerant mode
			// because css-tree doesn\'t yet handle nested rules in `@starting-style`.
			// The Raw content is opaque to depth tracking, so its lines are not checked.
			code: '.foo {\n\ttransition: opacity .4s;\n\n\t@starting-style {\n\t\t& {\n\t\t\topacity: 0;\n\t\t}\n\t}\n}\n'
		},
		{
			// Multi-line declaration value WITHOUT parens (e.g. `grid-template-areas`
			// string list). Continuation lines outside parens are a formatting choice
			// the rule does not enforce.
			code: '.foo {\n\tgrid-template-areas:\n\t\t"a b c"\n\t\t"d e f";\n}\n'
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
			// Missing indentation: declaration at depth 1 with zero leading whitespace.
			code: '.foo {\ncolor: hsl(0, 0%, 0%);\n}\n',
			errors: [ {
				messageId: 'incorrectIndent',
				data: { expected: '1 tab', actual: 'none' }
			} ]
		},
		{
			// Too few tabs: declaration at depth 2 with one tab.
			code: '.foo {\n\t& .bar {\n\tcolor: hsl(0, 0%, 0%);\n\t}\n}\n',
			errors: [ {
				messageId: 'incorrectIndent',
				data: { expected: '2 tabs', actual: '1 tab' }
			} ]
		},
		{
			// Too many tabs: declaration at depth 1 with two tabs.
			code: '.foo {\n\t\tcolor: hsl(0, 0%, 0%);\n}\n',
			errors: [ {
				messageId: 'incorrectIndent',
				data: { expected: '1 tab', actual: '2 tabs' }
			} ]
		},
		{
			// Two-space indent on a declaration.
			code: '.foo {\n  color: hsl(0, 0%, 0%);\n}\n',
			errors: [ incorrectIndent ]
		},
		{
			// Four-space indent on a declaration.
			code: '.foo {\n    color: hsl(0, 0%, 0%);\n}\n',
			errors: [ incorrectIndent ]
		},
		{
			// Space-indented nested rule. Three offending lines: opening, declaration, closing.
			code: '.foo {\n  & .bar {\n    color: hsl(0, 0%, 0%);\n  }\n}\n',
			errors: [
				incorrectIndent,
				incorrectIndent,
				incorrectIndent
			]
		},
		{
			// Single leading space.
			code: '.foo {\n color: hsl(0, 0%, 0%);\n}\n',
			errors: [ incorrectIndent ]
		},
		{
			// Mixed tab and spaces.
			code: '.foo {\n\t color: hsl(0, 0%, 0%);\n}\n',
			errors: [ {
				messageId: 'incorrectIndent',
				data: { expected: '1 tab', actual: '1 tab and 1 space' }
			} ]
		},
		{
			// Multi-line function with continuation lines NOT at outer + 1
			// (here at outer depth instead). Each offending continuation reports.
			code: '.foo {\n\tbackground: linear-gradient(\n\thsl(0, 0%, 0%),\n\thsl(0, 0%, 100%)\n\t);\n}\n',
			errors: [
				{
					messageId: 'incorrectIndent',
					data: { expected: '2 tabs', actual: '1 tab' }
				},
				{
					messageId: 'incorrectIndent',
					data: { expected: '2 tabs', actual: '1 tab' }
				}
			]
		}
	]
} );
