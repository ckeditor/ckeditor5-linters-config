/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { getTestRule } = require( 'jest-preset-stylelint' );
const path = require( 'path' );
const util = require( 'util' );

const PLUGIN_PATH = path.join( __dirname, '..', 'lib', 'license-header.js' ).replace( /\\/g, '/' );

global.testRule = getTestRule();

const config = [
	true,
	{
		headerLines:
			[
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			]
	}
];

const { ruleName } = require( PLUGIN_PATH );
const messages = {
	missing: `This file does not begin with a license header. (${ ruleName })`,
	notLicense: `This file begins with a comment that is not a license header. (${ ruleName })`,
	content: `Incorrect license header content. (${ ruleName })`,
	gap: `Disallowed gap before the license. (${ ruleName })`,
	emptyLine: `Missing empty line after the license. (${ ruleName })`
};

// For reasons that we don't understand, the `jest-preset-stylelint` package created additional `describe()` blocks for
// the plugin configuration and the checked code. It uses the `util.inspect()` function for making a string from the given `input`.
// Lets override it and return an empty string for these values to avoid a mess in a console.
// The original function is restored at the end of the file.
const defaultInspectFunction = util.inspect;

util.inspect = input => {
	// To hide empty input.
	if ( !input ) {
		return '';
	}

	// To hide: https://github.com/stylelint/jest-preset-stylelint/blob/3606955a27a22be789b9372b5dafaaab25401f7f/getTestRule.js#L172.
	if ( input === config ) {
		return '';
	}

	// To hide: https://github.com/stylelint/jest-preset-stylelint/blob/3606955a27a22be789b9372b5dafaaab25401f7f/getTestRule.js#L173.
	if ( input.includes( '@license Copyright (c) 2003-2022, CKSource Holding sp. z o.o.' ) ) {
		return '';
	}

	// To hide remaining test cases.
	const stringsToHide = [
		'.ck.ck-editor {\n\tmargin: 1.5em 0;\n}',
		'/* Comment */'
	];
	const shouldHide = stringsToHide.some( string => input === string );

	if ( shouldHide ) {
		return '';
	}

	// In all other cases, function should function normally.
	return defaultInspectFunction( input );
};

global.testRule( {
	plugins: [ PLUGIN_PATH ],
	ruleName,
	config,

	accept: [
		{
			description: 'File containing only the license, without trailing empty line.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			].join( '\n' )
		},
		{
			description: 'File containing only the license, with trailing empty line.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				''
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
			description: 'Reports error for empty file.',
			message: messages.missing,
			code: ''
		},
		{
			description: 'Reports error for file without comments.',
			message: messages.missing,
			code: [
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for file starting with comment that is not a license.',
			message: messages.notLicense,
			code: [
				'/* Comment */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with extra space at the beginning.',
			message: messages.content,
			code: [
				'/* ',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with missing space at the beginning.',
			message: messages.content,
			code: [
				'/*',
				'* @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with extra space at the end.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'  */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with missing space at the end.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'*/',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with extra part of the content.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' * This license has too much text.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with missing part of the content.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license that does not start at the first line of the file.',
			message: messages.gap,
			code: [
				'',
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
		},
		{
			description: 'Reports error for license that is not followed by an empty line.',
			message: messages.emptyLine,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		}
	]
} );

global.testRule( {
	plugins: [ PLUGIN_PATH ],
	ruleName,
	config,
	fix: true,

	reject: [
		{
			description: 'Fixes license with extra space at the beginning.',
			message: messages.content,
			code: [
				'/* ',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
		},
		{
			description: 'Fixes license with missing space at the beginning.',
			message: messages.content,
			code: [
				'/*',
				'* @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
		},
		{
			description: 'Fixes license with extra space at the end.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'  */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
		},
		{
			description: 'Fixes license with missing space at the end.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'*/',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
		},
		{
			description: 'Fixes license with extra part of the content.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' * This license has too much text.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
		},
		{
			description: 'Fixes license with missing part of the content.',
			message: messages.content,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
		},
		{
			description: 'Fixes license that does not start at the first line of the file.',
			message: messages.gap,
			code: [
				'',
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
		},
		{
			description: 'Fixes license that is not followed by an empty line.',
			message: messages.emptyLine,
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
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
	]
} );

// Restore the original function.
util.inspect = defaultInspectFunction;
