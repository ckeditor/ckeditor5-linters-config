/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const fixtureLoader = require( '../fixture-loader' );

const incorrectWhitespaceBeforeError = { message: 'Incorrect whitespace before the license header.' };
const incorrectWhitespaceAfterError = { message: 'Incorrect whitespace after the license header.' };
const unexpectedContentBeforeError = { message: 'Unexpected content before the license header.' };
const incorrectHeaderError = { message: 'The license header is incorrect.' };
const missingHeaderError = { message: 'The license header is missing.' };

const options = [ {
	headerLines: [
		'/**',
		' * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.',
		' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
		' */'
	]
} ];

const ruleTester = new RuleTester( {
	languageOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

const fixtures = fixtureLoader( 'license-header' );

const ruleName = 'eslint-plugin-ckeditor5-rules/license-header';
const rule = require( '../../lib/rules/license-header' );

ruleTester.run( ruleName, rule, {
	valid: [ {
		name: 'Header followed by whitespace only',
		options,
		code: fixtures.valid.header_and_whitespace.content
	}, {
		name: 'Header followed by another header-like comment without the @license tag',
		options,
		code: fixtures.valid.header_and_header_without_tag.content
	}, {
		name: 'Header followed by a line-comment copy of the header',
		options,
		code: fixtures.valid.header_and_line_comment_header.content
	}, {
		name: 'Header only',
		options,
		code: fixtures.valid.header_only.content
	}, {
		name: 'Header followed by code',
		options,
		code: fixtures.valid.header_with_code.content
	}, {
		name: 'Shebang followed by the header and code',
		options,
		code: fixtures.valid.header_with_shebang_and_code.content
	}, {
		name: 'Shebang followed by the header',
		options,
		code: fixtures.valid.header_with_shebang.content
	} ],

	invalid: [ {
		name: 'Missing empty line between the shebang and the header',
		options,
		errors: [ incorrectWhitespaceBeforeError ],
		code: fixtures.invalid.shebang_without_newline.content,
		output: fixtures.valid.header_with_shebang_and_code.content
	}, {
		name: 'Empty line before the header',
		options,
		errors: [ incorrectWhitespaceBeforeError ],
		code: fixtures.invalid.whitespace_before.content,
		output: fixtures.valid.header_with_code.content
	}, {
		name: 'Empty line before the header and missing empty line after it',
		options,
		errors: [ incorrectWhitespaceBeforeError, incorrectWhitespaceAfterError ],
		code: fixtures.invalid.whitespace_before_and_after.content,
		output: fixtures.valid.header_with_code.content
	}, {
		name: 'Missing empty line after the header',
		options,
		errors: [ incorrectWhitespaceAfterError ],
		code: fixtures.invalid.whitespace_after.content,
		output: fixtures.valid.header_with_code.content
	}, {
		name: 'Header written in all uppercase',
		options,
		errors: [ incorrectHeaderError ],
		code: fixtures.invalid.all_uppercase.content,
		output: fixtures.valid.header_with_code.content
	}, {
		name: 'Header-like comment without the @license tag',
		options,
		errors: [ missingHeaderError ],
		code: fixtures.invalid.missing_tag.content,
		output: fixtures.valid.header_and_header_without_tag.content
	}, {
		name: 'Header written as line comments',
		options,
		errors: [ missingHeaderError ],
		code: fixtures.invalid.line_comment.content,
		output: fixtures.valid.header_and_line_comment_header.content
	}, {
		name: 'Code without any header',
		options,
		errors: [ missingHeaderError ],
		code: fixtures.invalid.code_only.content,
		output: fixtures.valid.header_with_code.content
	}, {
		name: 'Empty file',
		options,
		errors: [ missingHeaderError ],
		code: '',
		output: fixtures.valid.header_and_whitespace.content
	},
	// Examples without fixers.
	{
		name: 'Block comment before the header',
		options,
		errors: [ unexpectedContentBeforeError ],
		code: fixtures.invalid.block_comment_before_license.content
	}, {
		name: 'Code between the shebang and the header',
		options,
		errors: [ unexpectedContentBeforeError ],
		code: fixtures.invalid.code_between_shebang_and_header.content
	}, {
		name: 'Comment between the shebang and the header',
		options,
		errors: [ unexpectedContentBeforeError ],
		code: fixtures.invalid.comment_between_shebang_and_header.content
	} ]
} );
