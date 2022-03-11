/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const path = require( 'path' );
const util = require( 'util' );

const inspect = util.inspect;

// Needed so that `testRule` is not caught.
/* eslint-disable no-undef */

const pluginPath = path.join( __dirname, '..', '..', 'lib', 'rules', 'license-header.js' ).replace( /\\/g, '/' );

const { ruleName } = require( pluginPath );
const { getTestRule } = require( 'jest-preset-stylelint' );

const messages = {
	missing: `This file does not begin with a license header. (${ ruleName })`,
	notLicense: `This file begins with a comment that is not a license header. (${ ruleName })`,
	content: `Incorrect license header content. (${ ruleName })`
};

global.testRule = getTestRule();

const config = [
	true,
	{
		headerContent:
			[
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license'
			]
	}
];

// For reasons that we don't understand, the `jest-preset-stylelint` package created additional `describe()` blocks for
// the plugin configuration and the checked code. It uses the `util.inspect()` function for making a string from the given `input`.
// Let's override it and return an empty string for these values to avoid a mess in a console.
// The original function is restored at the end of the file.
util.inspect = function( input ) {
	// To hide: https://github.com/stylelint/jest-preset-stylelint/blob/3606955a27a22be789b9372b5dafaaab25401f7f/getTestRule.js#L172.
	if ( input === config ) {
		return '';
	}

	// To hide: https://github.com/stylelint/jest-preset-stylelint/blob/3606955a27a22be789b9372b5dafaaab25401f7f/getTestRule.js#L173.
	if ( input.startsWith && input.startsWith( '/*' ) ) {
		return '';
	}

	return inspect( input );
};

testRule( {
	plugins: [ pluginPath ],
	ruleName,
	// TODO: update tests to have fixer data
	// fix: true,
	config,

	accept: [
		{
			description: 'File containing only the license.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			].join( '\n' )
		},
		{
			description: 'File containing the license and a CSS rule.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		}
	],

	reject: [
		{
			description: 'License with extra space at the beginning.',
			code: [
				'/* ',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			].join( '\n' ),

			message: messages.content
		},
		{
			description: 'License with missing space at the beginning.',
			code: [
				'/*',
				'* @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			].join( '\n' ),

			message: messages.content
		},
		{
			description: 'License with missing space at the end.',
			code: [
				'/* ',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'*/'
			].join( '\n' ),

			message: messages.content
		},
		{
			description: 'License with wrong content.',
			code: [
				'/* ',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */'
			].join( '\n' ),

			message: messages.content
		}
	]
} );

// Restore the original function.
util.inspect = inspect;
