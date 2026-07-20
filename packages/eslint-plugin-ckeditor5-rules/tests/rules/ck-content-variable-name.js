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
			name: 'An empty file',
			code: ''
		},
		{
			name: 'Unrelated selector using any variable',
			code: '.generic-selector { width: var(--variable-name); }'
		},
		{
			name: '.ck-content selector without variables',
			code: '.ck-content { width: 50px; }'
		},
		{
			name: '.ck-content selector using the allowed prefix',
			code: '.ck-content { width: var(--ck-content-variable-name); }'
		},
		{
			name: 'Allowed prefix with whitespace inside var( ... )',
			code: '.ck-content { width: var( --ck-content-variable-name ); }'
		},
		{
			name: 'Nested rule inside .ck-content using the allowed prefix',
			code: '.ck-content { .generic-selector { width: var(--ck-content-variable-name); } }'
		},
		{
			name: '.ck-content nested inside another selector, using the allowed prefix',
			code: '.generic-selector { .ck-content { width: var(--ck-content-variable-name); } }'
		},
		{
			name: 'Selector that merely contains the ck-content substring (e.g. .ck-contentish) must not be treated as .ck-content',
			code: '.ck-contentish { width: var(--variable-name); }'
		},
		{
			name: 'Same for .ck-content-extra and other suffixes',
			code: '.ck-content-extra { width: var(--variable-name); }'
		},
		{
			name: 'Multiple allowed-prefix variables in one declaration',
			code: '.ck-content { margin: var(--ck-content-a) var(--ck-content-b); }'
		},
		{
			name: 'ignoredVariableSubstrings option whitelists arbitrary substrings',
			options: [ { ignoredVariableSubstrings: [ '-suggestion-', '-comment-' ] } ],
			code: '.ck-content { color: var(--ck-suggestion-marker); background: var(--ck-comment-shadow); }'
		},
		{
			name: 'Multiple substrings in the option list',
			options: [ { ignoredVariableSubstrings: [ '-color-base-', '-foo-' ] } ],
			code: '.ck-content { background: var(--ck-color-base-bg); width: var(--ck-foo-width); }'
		},
		{
			name: 'Allowed-prefix variable inside a custom-property value (a Raw token)',
			code: '.ck-content { --ck-content-x: var(--ck-content-base); }'
		},
		{
			name: 'Allowed-prefix variable inside a var() fallback (a Raw token)',
			code: '.ck-content { width: var(--ck-content-x, var(--ck-content-fallback)); }'
		},
		{
			name: 'Custom-property values outside .ck-content are not constrained',
			code: ':root { --foo: var(--bad); }'
		}
	],

	invalid: [
		{
			name: '.ck-content selector using a disallowed variable',
			code: '.ck-content { width: var(--variable-name); }',
			errors: [ invalidVariableError ]
		},
		{
			name: '.ck-content combined with another selector using a disallowed variable',
			code: '.generic-selector.ck-content { width: var(--variable-name); }',
			errors: [ invalidVariableError ]
		},
		{
			name: 'Nested rule inside .ck-content using a disallowed variable',
			code: '.ck-content { .generic-selector { width: var(--variable-name); } }',
			errors: [ invalidVariableError ]
		},
		{
			name: '.ck-content nested inside another selector, using a disallowed variable',
			code: '.generic-selector { .ck-content { width: var(--variable-name); } }',
			errors: [ invalidVariableError ]
		},
		{
			name: 'One allowed and one disallowed variable in the same declaration - per-var() reports the bad one',
			code: '.ck-content { margin: var(--ck-content-good) var(--bad); }',
			errors: [ invalidVariableError ]
		},
		{
			name: 'Two disallowed variables in the same declaration - each reported',
			code: '.ck-content { margin: var(--bad-one) var(--bad-two); }',
			errors: [ invalidVariableError, invalidVariableError ]
		},
		{
			name: 'With no ignoredVariableSubstrings option, the rule has no exemptions - even -suggestion- variables report',
			code: '.ck-content { color: var(--ck-suggestion-marker); }',
			errors: [ invalidVariableError ]
		},
		{
			name: 'A variable whose name does not contain any configured ignored substring is reported despite the option being provided',
			options: [ { ignoredVariableSubstrings: [ '-suggestion-' ] } ],
			code: '.ck-content { width: var(--variable-name); }',
			errors: [ invalidVariableError ]
		},
		{
			name: 'Descendant-combinator selector: the match must stick once .ck-content is found anywhere in the prelude',
			code: '.ck-content .ck-suggestion-marker-formatBlock { color: var(--bad); }',
			errors: [ invalidVariableError ]
		},
		{
			name: '.ck-content followed by a descendant combinator + multiple classes',
			code: '.ck-content ul .ck-something { box-shadow: 0 0 0 1px var(--bad); }',
			errors: [ invalidVariableError ]
		},
		{
			name: 'Disallowed variable inside a custom-property value (a Raw token) - must be recovered by re-parsing the raw text',
			code: ':root,\n.ck-content {\n\t--ck-content-foo: var(--bad);\n}\n',
			errors: [ invalidVariableError ]
		},
		{
			name: 'Disallowed variable inside a var() fallback (a Raw token)',
			code: '.ck-content { width: var(--ck-content-x, var(--bad)); }',
			errors: [ invalidVariableError ]
		},
		{
			name: 'Disallowed variable nested inside a custom-property value\'s var() fallback - requires recursing into nested Raw tokens',
			code: '.ck-content { --ck-content-foo: var(--ck-content-x, var(--bad)); }',
			errors: [ invalidVariableError ]
		}
	]
} );
