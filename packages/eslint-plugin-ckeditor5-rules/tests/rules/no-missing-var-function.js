/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/no-missing-var-function';
const rule = require( '../../lib/rules/no-missing-var-function' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const missingVarError = name => ( {
	messageId: 'missingVarFunction',
	data: { name }
} );

ruleTester.run( ruleName, rule, {
	valid: [
		{
			name: 'An empty file',
			code: ''
		},
		{
			name: 'Proper var() usage',
			code: 'a { color: var(--brand); }'
		},
		{
			name: 'Proper var() usage inside a custom-property value',
			code: 'a { --x: var(--y); }'
		},
		{
			name: 'var() with a fallback',
			code: 'a { color: var(--brand, red); }'
		},
		{
			name: 'A regular keyword value',
			code: 'a { color: red; }'
		},
		{
			name: 'Custom property names are legitimate values of transition-property',
			code: 'a { transition-property: --x; }'
		},
		{
			name: 'Custom property names are legitimate values of will-change',
			code: 'a { will-change: --x; }'
		},
		{
			name: 'Anchor positioning names are dashed identifiers, not custom property references',
			code: 'a { anchor-name: --my-anchor; anchor-scope: --my-anchor; position-anchor: --my-anchor; }'
		},
		{
			name: 'Position try fallbacks and font palettes are named by dashed identifiers',
			code: 'a { position-try-fallbacks: --fallback; position-try: --fallback; font-palette: --my-palette; }'
		},
		{
			name: 'View transition and scroll-driven animation names are dashed identifiers, not custom property references',
			code: 'a { view-transition-name: --card; view-timeline-name: --reveal; }'
		},
		{
			name: 'A custom-property value that merely contains a dashed substring is not a lone reference',
			code: 'a { --x: 1px solid --not-alone; }'
		},
		{
			name: 'A properly nested var() fallback',
			code: 'a { color: var(--a, var(--b)); }'
		},
		{
			name: 'A non-lone dashed identifier in a custom property var() fallback is treated as data',
			code: 'a { --x: var(--a, 1px --b); }'
		},
		{
			name: 'Anchor functions reference anchor names, not custom properties',
			code: 'a { top: anchor(--target top); width: anchor-size(--target width); }'
		},
		{
			name: 'anchor() with a proper var() fallback',
			code: 'a { top: anchor(--target top, var(--fallback)); }'
		},
		{
			name: 'View transition classes and groups are named by dashed identifiers',
			code: 'a { view-transition-class: --card; view-transition-group: --parent; }'
		},
		{
			name: 'Descriptors inside descriptor at-rules are names, not custom property references',
			code: '@view-transition { types: --forward; }'
		}
	],

	invalid: [
		{
			name: 'A bare custom-property reference in a native property',
			code: 'a { color: --brand; }',
			errors: [ missingVarError( '--brand' ) ]
		},
		{
			name: 'A bare reference among other value tokens',
			code: 'a { margin: 0 --spacing; }',
			errors: [ missingVarError( '--spacing' ) ]
		},
		{
			name: 'A custom property assigned a bare reference (--x: --y)',
			code: 'a { --x: --y; }',
			errors: [ missingVarError( '--y' ) ]
		},
		{
			name: 'Two bare references are each reported',
			code: 'a { margin: --a --b; }',
			errors: [ missingVarError( '--a' ), missingVarError( '--b' ) ]
		},
		{
			name: 'A bare reference used as a var() fallback would be substituted as a literal token',
			code: 'a { color: var(--a, --b); }',
			errors: [ missingVarError( '--b' ) ]
		},
		{
			name: 'A bare reference in a nested var() fallback',
			code: 'a { color: var(--a, var(--b, --c)); }',
			errors: [ missingVarError( '--c' ) ]
		},
		{
			name: 'A bare reference among other tokens in a native property var() fallback',
			code: 'a { margin: var(--a, 1px --b); }',
			errors: [ missingVarError( '--b' ) ]
		},
		{
			name: 'A lone bare reference used as a var() fallback inside a custom property value',
			code: 'a { --x: var(--a, --b); }',
			errors: [ missingVarError( '--b' ) ]
		},
		{
			name: 'Custom-ident properties outside the exemption list are still checked',
			code: 'a { animation-name: --foo; }',
			errors: [ missingVarError( '--foo' ) ]
		},
		{
			name: 'Unicode custom property names are detected',
			code: 'a { --x: --café; }',
			errors: [ missingVarError( '--café' ) ]
		},
		{
			name: 'A comment before the bare reference does not hide it',
			code: 'a { --x: /* note */ --y; }',
			errors: [ missingVarError( '--y' ) ]
		},
		{
			name: 'A bare reference in the anchor() and anchor-size() fallback is a missing var()',
			code: 'a { top: anchor(--target top, --fallback); width: anchor-size(--target width, --f); }',
			errors: [ missingVarError( '--fallback' ), missingVarError( '--f' ) ]
		}
	]
} );
