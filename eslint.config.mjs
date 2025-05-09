/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import ckeditor5Config from 'eslint-config-ckeditor5';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';

export default defineConfig( [
	{
		extends: ckeditor5Config,

		plugins: {
			'ckeditor5-rules': ckeditor5Rules
		},

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node
			}
		},

		ignores: [
			'coverage/**',
			'packages/*/tests/fixtures/**'
		],

		rules: {
			'no-console': 'off',
			'ckeditor5-rules/license-header': [ 'error', {
				headerLines: [
					'/**',
					' * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
					' * For licensing, see LICENSE.md.',
					' */'
				]
			} ]
		}
	}
] );
