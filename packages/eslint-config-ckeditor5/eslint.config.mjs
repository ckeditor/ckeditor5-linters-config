/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import mocha from 'eslint-plugin-mocha';
import stylistic from '@stylistic/eslint-plugin';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';

const rulesGeneral = [
	{
		plugins: {
			js,
			'@stylistic': stylistic
		},

		extends: [ 'js/recommended' ],

		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module'
		},

		rules: {
			/*
			╭──────────────────────────────────────────────────────────────────────╮
			│ Rules for detecting errors, problems, suggestions and best practices │
			╰──────────────────────────────────────────────────────────────────────╯
			*/

			// Offing because we keep the browser env disabled so when using a console you need to define
			// it as a global variable anyway.
			'no-console': 'off',

			// Offing because there's nothing wrong with good `while ( true )` with a return statement.
			'no-constant-condition': 'off',

			'curly': [ 'error', 'all' ],

			'dot-notation': 'error',

			'no-alert': 'error',

			'no-caller': 'error',

			'no-case-declarations': 'error',

			'no-eval': 'error',

			'no-extend-native': 'error',

			'no-implicit-coercion': [ 'error', {
				boolean: false,
				string: true,
				number: true
			} ],

			'no-implied-eval': 'error',

			'no-labels': 'error',

			'no-lone-blocks': 'error',

			'no-multi-str': 'error',

			'no-new': 'error',

			'no-new-func': 'error',

			'no-new-wrappers': 'error',

			'no-return-assign': 'error',

			'no-self-compare': 'error',

			'no-sequences': 'error',

			'no-unused-expressions': 'error',

			'no-useless-call': 'error',

			'no-useless-concat': 'error',

			'no-useless-escape': 'error',

			'no-useless-return': 'error',

			'no-void': 'error',

			'no-with': 'error',

			'yoda': [ 'error', 'never' ],

			'no-use-before-define': [ 'error', {
				functions: false,
				classes: false,
				variables: true
			} ],

			'camelcase': [ 'error', {
				properties: 'never'
			} ],

			'consistent-this': [ 'error', 'that' ],

			'new-cap': [ 'error', {
				capIsNewExceptionPattern: 'Mixin$'
			} ],

			'no-array-constructor': 'error',

			'no-nested-ternary': 'error',

			'no-object-constructor': 'error',

			'one-var': [ 'error', {
				initialized: 'never'
			} ],

			'unicode-bom': [ 'error', 'never' ],

			'no-duplicate-imports': 'error',

			'no-useless-computed-key': 'error',

			'no-useless-constructor': 'error',

			'no-var': 'error',

			'object-shorthand': 'error',

			'prefer-const': [ 'error', {
				destructuring: 'all',
				ignoreReadBeforeAssign: true
			} ],

			'prefer-rest-params': 'error',

			'prefer-spread': 'error',

			'symbol-description': 'error',

			// Brings more trouble than profit. When defining callbacks which are called in a specific context,
			// or when defining functions which are later assigned to some objects.
			// 'no-invalid-this': 'error',

			// Brings more confusion than profit. Especially useless when using `map()` or `filter()`
			// inside some other loops.
			// 'no-loop-func': 'error',

			/*
			╭───────────────────────────────────────────────────────╮
			│ Stylistic rules for source code layout and formatting │
			╰───────────────────────────────────────────────────────╯
			*/

			'@stylistic/dot-location': [ 'error', 'property' ],

			'@stylistic/no-multi-spaces': 'error',

			'@stylistic/wrap-iife': 'error',

			'@stylistic/array-bracket-spacing': [ 'error', 'always' ],

			'@stylistic/block-spacing': [ 'error', 'always' ],

			'@stylistic/comma-dangle': [ 'error', 'never' ],

			'@stylistic/comma-spacing': [ 'error', {
				before: false,
				after: true
			} ],

			'@stylistic/comma-style': [ 'error', 'last' ],

			'@stylistic/computed-property-spacing': [ 'error', 'always' ],

			'@stylistic/eol-last': [ 'error', 'always' ],

			'@stylistic/func-call-spacing': [ 'error', 'never' ],

			'@stylistic/indent': [ 'error', 'tab', {
				SwitchCase: 1
			} ],

			'@stylistic/keyword-spacing': 'error',

			'@stylistic/key-spacing': 'error',

			'@stylistic/linebreak-style': [ 'error', 'unix' ],

			'@stylistic/lines-around-comment': [ 'error', {
				beforeBlockComment: true,
				allowObjectStart: true,
				allowBlockStart: true,
				allowArrayStart: true
			} ],

			'@stylistic/max-len': [ 'error', 140 ],

			'@stylistic/max-statements-per-line': [ 'error', {
				max: 1
			} ],

			'@stylistic/new-parens': 'error',

			'@stylistic/no-multiple-empty-lines': [ 'error', {
				max: 1
			} ],

			'@stylistic/no-trailing-spaces': 'error',

			'@stylistic/no-whitespace-before-property': 'error',

			'@stylistic/object-curly-spacing': [ 'error', 'always' ],

			'@stylistic/operator-linebreak': [ 'error', 'after' ],

			'@stylistic/padded-blocks': [ 'error', 'never' ],

			'@stylistic/quote-props': [ 'error', 'as-needed', {
				unnecessary: false
			} ],

			'@stylistic/quotes': [ 'error', 'single' ],

			'@stylistic/semi': 'error',

			'@stylistic/semi-spacing': [ 'error', {
				before: false,
				after: true
			} ],

			'@stylistic/space-before-blocks': [ 'error', 'always' ],

			'@stylistic/space-before-function-paren': [ 'error', {
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always'
			} ],

			'@stylistic/space-infix-ops': 'error',

			'@stylistic/space-in-parens': [ 'error', 'always' ],

			'@stylistic/space-unary-ops': [ 'error', {
				words: true,
				nonwords: false
			} ],

			'@stylistic/spaced-comment': [ 'error', 'always' ],

			'@stylistic/template-tag-spacing': [ 'error', 'never' ],

			'@stylistic/arrow-parens': [ 'error', 'as-needed' ],

			'@stylistic/arrow-spacing': 'error',

			'@stylistic/generator-star-spacing': [ 'error', 'after' ],

			'@stylistic/template-curly-spacing': [ 'error', 'always' ],

			'@stylistic/yield-star-spacing': [ 'error', 'after' ]

			// This is too pedantic. It makes writing callbacks such as `value => value ? 1 : 2` impossible
			// '@stylistic/no-confusing-arrow': 'error',

			// We can't use this rule because we allow comments before `else`.
			// Make sure to report such case to ESLint.
			// '@stylistic/brace-style': [
			// 	'error',
			// 	'1tbs'
			// ],
		}
	}
];

const rulesTypeScript = [
	{
		plugins: {
			ts
		},

		extends: [ 'ts/recommended' ],

		files: [ '**/*.@(ts|tsx)' ],

		rules: {
			/*
			╭──────────────────────────────────────────────────────────────────────╮
			│ Rules for detecting errors, problems, suggestions and best practices │
			╰──────────────────────────────────────────────────────────────────────╯
			*/

			'@typescript-eslint/array-type': [ 'error', {
				default: 'generic'
			} ],

			'@typescript-eslint/no-unsafe-function-type': 'off',

			'@typescript-eslint/no-empty-object-type': 'error',

			'@typescript-eslint/no-wrapper-object-types': 'error',

			'@typescript-eslint/consistent-type-assertions': [ 'error', {
				assertionStyle: 'as',
				objectLiteralTypeAssertions: 'allow-as-parameter'
			} ],

			'@typescript-eslint/consistent-type-imports': 'error',

			'@typescript-eslint/explicit-module-boundary-types': [ 'error', {
				allowedNames: [ 'requires', 'pluginName' ],
				allowArgumentsExplicitlyTypedAsAny: true
			} ],

			'@typescript-eslint/explicit-member-accessibility': [ 'error', {
				accessibility: 'explicit',
				overrides: {
					constructors: 'off'
				}
			} ],

			'@typescript-eslint/no-confusing-non-null-assertion': 'error',

			'@typescript-eslint/no-empty-function': 'off',

			'@typescript-eslint/no-empty-interface': 'off',

			'@typescript-eslint/no-explicit-any': 'off',

			'@typescript-eslint/no-inferrable-types': 'off',

			'@typescript-eslint/no-invalid-void-type': 'error',

			'@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',

			'@typescript-eslint/no-non-null-assertion': 'off',

			'@typescript-eslint/parameter-properties': 'error',

			'@typescript-eslint/unified-signatures': 'error',

			/*
			╭─────────────────╮
			│ Extension rules │
			╰─────────────────╯
			*/

			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-expressions': 'error',

			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'error',

			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': [ 'error', {
				functions: false,
				classes: false,
				variables: true,
				typedefs: false,
				ignoreTypeReferences: true
			} ],

			'no-array-constructor': 'off',
			'@typescript-eslint/no-array-constructor': 'error',

			'no-useless-constructor': 'off',
			'@typescript-eslint/no-useless-constructor': 'error',

			/*
			╭───────────────────────────────────────────────────────╮
			│ Stylistic rules for source code layout and formatting │
			╰───────────────────────────────────────────────────────╯
			*/

			'@stylistic/member-delimiter-style': 'error',

			'@stylistic/type-annotation-spacing': 'error'
		}
	}
];

const rulesSourceCode = [
	{
		plugins: {
			'ckeditor5-rules': ckeditor5Rules
		},

		files: [ '**/src/**/*.@(ts|tsx)' ],

		settings: {
			disallowedCrossImportsPackages: [
				'ckeditor5-watchdog'
			]
		},

		rules: {
			'ckeditor5-rules/no-relative-imports': 'error',

			'ckeditor5-rules/ckeditor-error-message': 'error',

			'ckeditor5-rules/no-cross-package-imports': 'error',

			'ckeditor5-rules/no-scoped-imports-within-package': 'error',

			'ckeditor5-rules/use-require-for-debug-mode-imports': 'error',

			'ckeditor5-rules/no-istanbul-in-debug-code': 'error',

			'ckeditor5-rules/allow-declare-module-only-in-augmentation-file': 'error',

			'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'error',

			'ckeditor5-rules/require-as-const-returns-in-methods': [ 'error', {
				methodNames: [ 'requires', 'pluginName' ]
			} ],

			'ckeditor5-rules/ckeditor-plugin-flags': [ 'error', {
				disallowedFlags: [ 'isOfficialPlugin', 'isPremiumPlugin' ]
			} ]
		}
	}
];

const rulesTests = [
	{
		plugins: {
			mocha
		},

		files: [ '**/tests/**/*.@(js|ts)' ],

		languageOptions: {
			globals: {
				...globals.chai,
				...globals.mocha,
				sinon: true
			}
		},

		rules: {
			'mocha/handle-done-callback': 'error',

			'mocha/no-async-suite': 'error',

			'mocha/no-exclusive-tests': 'error',

			'mocha/no-global-tests': 'error',

			'mocha/no-identical-title': 'warn',

			'mocha/no-nested-tests': 'error',

			'mocha/no-pending-tests': 'error',

			'mocha/no-sibling-hooks': 'error',

			'mocha/no-top-level-hooks': 'error',

			'ckeditor5-rules/no-scoped-imports-within-package': 'off',

			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-expressions': 'off'
		}
	}
];

const rulesDocs = [
	{
		files: [ '**/docs/**/*.@(js|ts)' ],

		rules: {
			'ckeditor5-rules/no-scoped-imports-within-package': 'off'
		}
	}
];

export default defineConfig( [
	rulesGeneral,
	rulesTypeScript,
	rulesSourceCode,
	rulesTests,
	rulesDocs
] );
