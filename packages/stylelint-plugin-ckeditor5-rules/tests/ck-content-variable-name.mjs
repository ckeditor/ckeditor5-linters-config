/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { getTestRule } from 'jest-preset-stylelint';
import ckContentVariableName from '../lib/ck-content-variable-name.mjs';

const { ruleName } = ckContentVariableName;

const message = `Variables inside the '.ck-content' selector have to use the '--ck-content-*' prefix. (${ ruleName })`;

getTestRule()( {
	plugins: [ ckContentVariableName ],
	ruleName,
	config: true,

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
			description: 'File containing the ".ck-content" selector using valid variable name with spacing.',
			code: [
				'.ck-content {',
				'	width: var( --ck-content-variable-name );',
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
