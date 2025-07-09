/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { getTestRule } = require( 'jest-preset-stylelint' );
const upath = require( 'upath' );
const util = require( 'util' );

const PLUGIN_PATH = upath.join( __dirname, '..', 'lib', 'ck-content-variable-name.js' );

global.testRule = getTestRule();

const config = [
	true
];

const { ruleName } = require( PLUGIN_PATH );

const message = [
	'Variables inside the \'.ck-content\' selector have to use the \'--ck-content-*\' prefix.',
	'(ckeditor5-rules/ck-content-variable-name)'
].join( ' ' );

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
	const stringsToHide = [ 'CKSource Holding', '.ck.ck-editor' ];
	const shouldHide = stringsToHide.some( string => input.includes( string ) );

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
			description: 'An empty file.',
			code: ''
		},
		{
			description: 'File containing unrelated selector using any variable.',
			code: [
				'.generic-selector {',
				'	width: var(--variable-name);',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing the ".ck-content" selector not using variables.',
			code: [
				'.ck-content {',
				'	width: 50px;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing the ".ck-content" selector using valid variable name.',
			code: [
				'.ck-content {',
				'	width: var(--ck-content-variable-name);',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing the ".ck-content" selector with nested selectors using valid variable name.',
			code: [
				'.ck-content {',
				'	.generic-selector {',
				'		width: var(--ck-content-variable-name);',
				'	}',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing nested ".ck-content" selector using valid variable name.',
			code: [
				'.generic-selector {',
				'	.ck-content {',
				'		width: var(--ck-content-variable-name);',
				'	}',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing ".ck-content" selector using comment variable name.',
			code: [
				'.ck-content {',
				'	width: var(--comment-variable-name);',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing ".ck-content" selector using suggestion variable name.',
			code: [
				'.ck-content {',
				'	width: var(--suggestion-variable-name);',
				'}',
				''
			].join( '\n' )
		}
	],

	reject: [
		{
			description: 'File containing the ".ck-content" selector using invalid variable name.',
			message,
			code: [
				'.ck-content {',
				'	width: var(--variable-name);',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing the ".ck-content" selector combined with other selectors using invalid variable name.',
			message,
			code: [
				'.generic-selector.ck-content {',
				'	width: var(--variable-name);',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing the ".ck-content" selector with nested selectors using invalid variable name.',
			message,
			code: [
				'.ck-content {',
				'	.generic-selector {',
				'		width: var(--variable-name);',
				'	}',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'File containing nested ".ck-content" selector using invalid variable name.',
			message,
			code: [
				'.generic-selector {',
				'	.ck-content {',
				'		width: var(--variable-name);',
				'	}',
				'}',
				''
			].join( '\n' )
		}
	]
} );

// Restore the original function.
util.inspect = defaultInspectFunction;
