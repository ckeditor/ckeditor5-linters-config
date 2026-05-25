/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/ck-content-variable-name';
const rule = require( '../../lib/rules/ck-content-variable-name' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const invalidVariableError = { messageId: 'invalidVariable' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			// An empty file.
			code: ''
		},
		{
			// Unrelated selector using any variable.
			code: '.generic-selector { width: var(--variable-name); }'
		},
		{
			// `.ck-content` selector without variables.
			code: '.ck-content { width: 50px; }'
		},
		{
			// `.ck-content` selector using the allowed prefix.
			code: '.ck-content { width: var(--ck-content-variable-name); }'
		},
		{
			// Allowed prefix with whitespace inside `var( ... )`.
			code: '.ck-content { width: var( --ck-content-variable-name ); }'
		},
		{
			// Nested rule inside `.ck-content` using the allowed prefix.
			code: '.ck-content { .generic-selector { width: var(--ck-content-variable-name); } }'
		},
		{
			// `.ck-content` nested inside another selector, using the allowed prefix.
			code: '.generic-selector { .ck-content { width: var(--ck-content-variable-name); } }'
		},
		{
			// Allowed `-comment-` variables.
			code: '.ck-content { width: var(--comment-variable-name); }'
		},
		{
			// Allowed `-suggestion-` variables.
			code: '.ck-content { width: var(--suggestion-variable-name); }'
		}
	],

	invalid: [
		{
			// `.ck-content` selector using a disallowed variable.
			code: '.ck-content { width: var(--variable-name); }',
			errors: [ invalidVariableError ]
		},
		{
			// `.ck-content` combined with another selector using a disallowed variable.
			code: '.generic-selector.ck-content { width: var(--variable-name); }',
			errors: [ invalidVariableError ]
		},
		{
			// Nested rule inside `.ck-content` using a disallowed variable.
			code: '.ck-content { .generic-selector { width: var(--variable-name); } }',
			errors: [ invalidVariableError ]
		},
		{
			// `.ck-content` nested inside another selector, using a disallowed variable.
			code: '.generic-selector { .ck-content { width: var(--variable-name); } }',
			errors: [ invalidVariableError ]
		}
	]
} );
