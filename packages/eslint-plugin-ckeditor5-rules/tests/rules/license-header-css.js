/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/license-header';
const rule = require( '../../lib/rules/license-header' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const headerLines = [
	'/*',
	' * Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.',
	' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options',
	' */'
];

const options = [ { headerLines } ];
const header = headerLines.join( '\n' );
const body = '.ck-content { color: red; }';

const missingHeaderError = { message: 'The license header is missing.' };
const incorrectHeaderError = { message: 'The license header is incorrect.' };
const incorrectWhitespaceBeforeError = { message: 'Incorrect whitespace before the license header.' };
const incorrectWhitespaceAfterError = { message: 'Incorrect whitespace after the license header.' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			// Header only.
			options,
			code: header + '\n'
		},
		{
			// Header followed by a blank line and a rule.
			options,
			code: header + '\n\n' + body + '\n'
		},
		{
			// Empty rule body - header is still validated.
			options,
			code: header + '\n\n.foo {}\n'
		}
	],

	invalid: [
		{
			// Completely missing header.
			options,
			code: body + '\n',
			errors: [ missingHeaderError ],
			output: header + '\n\n' + body + '\n'
		},
		{
			// Truly empty file.
			options,
			code: '',
			errors: [ missingHeaderError ],
			output: header + '\n\n'
		},
		{
			// Wrong wording inside the header comment.
			options,
			code: '/*\n * Copyright (c) something else.\n */\n\n' + body + '\n',
			errors: [ incorrectHeaderError ],
			output: header + '\n\n' + body + '\n'
		},
		{
			// Whitespace before the header.
			options,
			code: '\n\n' + header + '\n\n' + body + '\n',
			errors: [ incorrectWhitespaceBeforeError ],
			output: header + '\n\n' + body + '\n'
		},
		{
			// Missing blank line between header and the next rule.
			options,
			code: header + '\n' + body + '\n',
			errors: [ incorrectWhitespaceAfterError ],
			output: header + '\n\n' + body + '\n'
		}
	]
} );
