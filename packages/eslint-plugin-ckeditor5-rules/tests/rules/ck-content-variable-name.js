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
			// Selector that merely contains the `ck-content` substring (e.g. `.ck-contentish`)
			// must not be treated as `.ck-content` - exact class match is required.
			code: '.ck-contentish { width: var(--variable-name); }'
		},
		{
			// Same for `.ck-content-extra` and other suffixes.
			code: '.ck-content-extra { width: var(--variable-name); }'
		},
		{
			// Multiple allowed-prefix variables in one declaration.
			code: '.ck-content { margin: var(--ck-content-a) var(--ck-content-b); }'
		},
		{
			// `ignoredVariableSubstrings` option whitelists arbitrary substrings.
			options: [ { ignoredVariableSubstrings: [ '-suggestion-', '-comment-' ] } ],
			code: '.ck-content { color: var(--ck-suggestion-marker); background: var(--ck-comment-shadow); }'
		},
		{
			// Multiple substrings in the option list.
			options: [ { ignoredVariableSubstrings: [ '-color-base-', '-foo-' ] } ],
			code: '.ck-content { background: var(--ck-color-base-bg); width: var(--ck-foo-width); }'
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
		},
		{
			// One allowed and one disallowed variable in the same declaration -
			// the prior whole-value check let this pass; per-`var()` reports the bad one.
			code: '.ck-content { margin: var(--ck-content-good) var(--bad); }',
			errors: [ invalidVariableError ]
		},
		{
			// Two disallowed variables in the same declaration - each reported.
			code: '.ck-content { margin: var(--bad-one) var(--bad-two); }',
			errors: [ invalidVariableError, invalidVariableError ]
		},
		{
			// With no `ignoredVariableSubstrings` option, the rule has no exemptions -
			// even `-suggestion-` variables report (no defaults are applied).
			code: '.ck-content { color: var(--ck-suggestion-marker); }',
			errors: [ invalidVariableError ]
		},
		{
			// A variable whose name does not contain any configured ignored substring
			// is reported despite the option being provided.
			options: [ { ignoredVariableSubstrings: [ '-suggestion-' ] } ],
			code: '.ck-content { width: var(--variable-name); }',
			errors: [ invalidVariableError ]
		},
		{
			// Descendant-combinator selector: `.ck-content` appears as the first class
			// but the prelude continues with additional class selectors. The match must
			// stick once `.ck-content` is found anywhere in the prelude.
			code: '.ck-content .ck-suggestion-marker-formatBlock { color: var(--bad); }',
			errors: [ invalidVariableError ]
		},
		{
			// `.ck-content` followed by a descendant combinator + multiple classes.
			code: '.ck-content ul .ck-something { box-shadow: 0 0 0 1px var(--bad); }',
			errors: [ invalidVariableError ]
		}
	]
} );
