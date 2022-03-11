/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const { getTestRule } = require( 'jest-preset-stylelint' );
const path = require( 'path' );
const util = require( 'util' );

const PLUGIN_PATH = path.join( __dirname, '..', '..', 'lib', 'rules', 'license-header.js' ).replace( /\\/g, '/' );

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

const { ruleName } = require( PLUGIN_PATH );
const messages = {
	missing: `This file does not begin with a license header. (${ ruleName })`,
	notLicense: `This file begins with a comment that is not a license header. (${ ruleName })`,
	content: `Incorrect license header content. (${ ruleName })`,
	gap: `Disallowed gap before the license. (${ ruleName })`
};

// For reasons that we don't understand, the `jest-preset-stylelint` package created additional `describe()` blocks for
// the plugin configuration and the checked code. It uses the `util.inspect()` function for making a string from the given `input`.
// Lets override it and return an empty string for these values to avoid a mess in a console.
// The original function is restored at the end of the file.
const defaultInspectFunction = util.inspect;

util.inspect = () => {
	return '';
};

global.testRule( {
	plugins: [ PLUGIN_PATH ],
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
			description: 'Empty file.',
			code: '',

			message: messages.missing
		},
		{
			description: 'File without comments.',
			code: [
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}'
			].join( '\n' ),

			message: messages.missing
		},
		{
			description: 'File starting with comment that is not a license.',
			code: [
				'/* Comment */'
			].join( '\n' ),

			message: messages.notLicense
		},
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
			description: 'License with extra space at the end.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'  */'
			].join( '\n' ),

			message: messages.content
		},
		{
			description: 'License with missing space at the end.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'*/'
			].join( '\n' ),

			message: messages.content
		},
		{
			description: 'License with extra part of the content.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' * This license has too much text.',
				' */'
			].join( '\n' ),

			message: messages.content
		},
		{
			description: 'License with missing part of the content.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */'
			].join( '\n' ),

			message: messages.content
		},
		{
			description: 'License that does not start at the first line of the file.',
			code: [
				'',
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			].join( '\n' ),

			message: messages.gap
		}
	]
} );

// Restore the original function.
util.inspect = defaultInspectFunction;
