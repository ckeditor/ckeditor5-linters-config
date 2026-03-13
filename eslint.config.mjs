/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import ckeditor5Config from 'eslint-config-ckeditor5';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';

const projectPackages = fs
	.readdirSync( path.resolve( import.meta.dirname, 'packages' ), { withFileTypes: true } )
	.filter( dirent => dirent.isDirectory() )
	.map( dirent => dirent.name );

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
					' * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.',
					' * For licensing, see LICENSE.md.',
					' */'
				]
			} ]
		}
	},
	{
		files: [ '.changelog/**/*.md' ],
		plugins: {
			'ckeditor5-rules': ckeditor5Rules
		},
		language: 'markdown/gfm',
		languageOptions: {
			frontmatter: 'yaml'
		},
		rules: {
			'ckeditor5-rules/validate-changelog-entry': [ 'error', {
				allowedScopes: projectPackages,
				repositoryType: 'mono'
			} ]
		}
	}
] );
