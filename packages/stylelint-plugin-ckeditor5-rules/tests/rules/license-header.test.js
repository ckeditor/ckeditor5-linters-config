/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const path = require( 'path' );

// Needed so that `testRule` is not caught.
/* eslint-disable no-undef */

const pluginPath = path.join( __dirname, '..', '..', 'lib', 'rules', 'license-header.js' ).replace( /\\/g, '/' );

const { ruleName } = require( pluginPath );
const { getTestRule } = require( 'jest-preset-stylelint' );

// const messages = {
// 	missing: 'This file does not begin with a license header.',
// 	notLicense: 'This file begins with a comment that is not a license header.',
// 	content: 'Incorrect license header content.',
// 	spacing: 'Incorrect license header spacing.'
// };

global.testRule = getTestRule( { plugins: [ pluginPath ] } );

testRule( {
	plugins: [ '.' ],
	ruleName,
	fix: true,
	config: [ true,	{ headerContent: [
		' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
		' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license'
	] } ],

	accept: [
		{
			description: 'File containing only the license.',
			code: [
				'/*',
				' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			].join( '\n' )
		}
	]

	// reject: [
	// 	{
	// 		description: 'License with extra space at the beginning.',
	// 		code: [
	// 			'/* ',
	// 			' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
	// 			' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
	// 			' */'
	// 		].join( '\n' )
	// 	}

	// 	/*
	// 	{
	// 		code: '.myClass {}',
	// 		fixed: '.my-class {}',
	// 		description: 'camel case class selector',
	// 		message: messages.missing,
	// 		line: 1,
	// 		column: 1,
	// 		endLine: 1,
	// 		endColumn: 8
	// 	}
	// 	*/
	// ]
} );
