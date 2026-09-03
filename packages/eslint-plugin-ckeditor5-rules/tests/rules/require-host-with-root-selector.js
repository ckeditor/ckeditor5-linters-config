/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/require-host-with-root-selector';
const rule = require( '../../lib/rules/require-host-with-root-selector' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const missingHostError = { messageId: 'missingHostSelector' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			name: 'Empty file.',
			code: ''
		},
		{
			name: 'No `:root` selector at all.',
			code: '.ck-button { display: block; }'
		},
		{
			name: '`:root` paired with `:host`.',
			code: ':root,\n:host {\n\t--ck-border-radius: 2px;\n}'
		},
		{
			name: '`:root` paired with `:host` on a single line.',
			code: ':root, :host { --ck-border-radius: 2px; }'
		},
		{
			name: '`:host` listed before `:root`.',
			code: ':host,\n:root {\n\t--ck-border-radius: 2px;\n}'
		},
		{
			name: '`:host` alone.',
			code: ':host { --ck-border-radius: 2px; }'
		},
		{
			name: 'Paired inside an at-rule.',
			code: '@media screen and (max-width: 600px) {\n\t:root,\n\t:host {\n\t\t--ck-link-panel-width: 300px;\n\t}\n}'
		},
		{
			name: 'A compound selector using `:root` is not the root scope declaration.',
			code: ':root .ck-button { display: block; }'
		},
		{
			name: 'Selector list of a compound `:root` selector and other selectors.',
			code: ':root .ck-button,\n.ck-editor { display: block; }'
		}
	],

	invalid: [
		{
			name: '`:root` alone.',
			code: ':root {\n\t--ck-border-radius: 2px;\n}',
			output: ':root,\n:host {\n\t--ck-border-radius: 2px;\n}',
			errors: [ { ...missingHostError, line: 1, column: 1 } ]
		},
		{
			name: '`:root` alone on a single line.',
			code: ':root { --ck-border-radius: 2px; }',
			output: ':root,\n:host { --ck-border-radius: 2px; }',
			errors: [ missingHostError ]
		},
		{
			name: 'Nested in an at-rule, indentation preserved.',
			code: '@media screen and (max-width: 600px) {\n\t:root {\n\t\t--ck-link-panel-width: 300px;\n\t}\n}',
			output: '@media screen and (max-width: 600px) {\n\t:root,\n\t:host {\n\t\t--ck-link-panel-width: 300px;\n\t}\n}',
			errors: [ { ...missingHostError, line: 2, column: 2 } ]
		},
		{
			name: '`:root` in a selector list with other selectors.',
			code: ':root,\n.ck-editor {\n\t--ck-border-radius: 2px;\n}',
			output: ':root,\n:host,\n.ck-editor {\n\t--ck-border-radius: 2px;\n}',
			errors: [ missingHostError ]
		},
		{
			name: 'A parameterized `:host(…)` does not satisfy the pairing.',
			code: ':root,\n:host(.ck-fullscreen) {\n\t--ck-border-radius: 2px;\n}',
			output: ':root,\n:host,\n:host(.ck-fullscreen) {\n\t--ck-border-radius: 2px;\n}',
			errors: [ missingHostError ]
		},
		{
			name: 'Every unpaired `:root` rule is reported.',
			code: ':root {\n\t--ck-a: 1px;\n}\n\n:root {\n\t--ck-b: 2px;\n}',
			output: ':root,\n:host {\n\t--ck-a: 1px;\n}\n\n:root,\n:host {\n\t--ck-b: 2px;\n}',
			errors: [
				{ ...missingHostError, line: 1, column: 1 },
				{ ...missingHostError, line: 5, column: 1 }
			]
		}
	]
} );
