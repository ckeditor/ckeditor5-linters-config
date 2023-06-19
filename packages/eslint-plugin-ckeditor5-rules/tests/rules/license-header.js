/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
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
		' * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.',
		' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
		' */'
	]
} ];

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

const fixtures = fixtureLoader( 'license-header' );

const ruleName = 'eslint-plugin-ckeditor5-rules/license-header';
const rule = require( '../../lib/rules/license-header' );

ruleTester.run( ruleName, rule, {
	valid: [ {
		options,
		code: fixtures.valid.header_and_whitespace.content
	}, {
		options,
		code: fixtures.valid.header_and_header_without_tag.content
	}, {
		options,
		code: fixtures.valid.header_and_line_comment_header.content
	}, {
		options,
		code: fixtures.valid.header_only.content
	}, {
		options,
		code: fixtures.valid.header_with_code.content
	}, {
		options,
		code: fixtures.valid.header_with_shebang_and_code.content
	}, {
		options,
		code: fixtures.valid.header_with_shebang.content
	} ],

	invalid: [ {
		options,
		errors: [ incorrectWhitespaceBeforeError ],
		code: fixtures.invalid.shebang_without_newline.content,
		output: fixtures.valid.header_with_shebang_and_code.content
	}, {
		options,
		errors: [ incorrectWhitespaceBeforeError ],
		code: fixtures.invalid.whitespace_before.content,
		output: fixtures.valid.header_with_code.content
	}, {
		options,
		errors: [ incorrectWhitespaceBeforeError, incorrectWhitespaceAfterError ],
		code: fixtures.invalid.whitespace_before_and_after.content,
		output: fixtures.valid.header_with_code.content
	}, {
		options,
		errors: [ incorrectWhitespaceAfterError ],
		code: fixtures.invalid.whitespace_after.content,
		output: fixtures.valid.header_with_code.content
	}, {
		options,
		errors: [ incorrectHeaderError ],
		code: fixtures.invalid.all_uppercase.content,
		output: fixtures.valid.header_with_code.content
	}, {
		options,
		errors: [ missingHeaderError ],
		code: fixtures.invalid.missing_tag.content,
		output: fixtures.valid.header_and_header_without_tag.content
	}, {
		options,
		errors: [ missingHeaderError ],
		code: fixtures.invalid.line_comment.content,
		output: fixtures.valid.header_and_line_comment_header.content
	}, {
		options,
		errors: [ missingHeaderError ],
		code: fixtures.invalid.code_only.content,
		output: fixtures.valid.header_with_code.content
	}, {
		options,
		errors: [ missingHeaderError ],
		code: '', // Empty file.
		output: fixtures.valid.header_and_whitespace.content
	},
	// Examples without fixers.
	{
		options,
		errors: [ unexpectedContentBeforeError ],
		code: fixtures.invalid.block_comment_before_license.content
	}, {
		options,
		errors: [ unexpectedContentBeforeError ],
		code: fixtures.invalid.code_between_shebang_and_header.content
	}, {
		options,
		errors: [ unexpectedContentBeforeError ],
		code: fixtures.invalid.comment_between_shebang_and_header.content
	} ]
} );
