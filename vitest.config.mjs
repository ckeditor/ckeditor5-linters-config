/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig( {
	test: {
		projects: [
			{
				test: {
					name: 'eslint-config-ckeditor5',
					root: './packages/eslint-config-ckeditor5',
					include: [
						'tests/**/*.mjs'
					]
				}
			},
			{
				test: {
					name: 'eslint-plugin-ckeditor5-rules:rules',
					root: './packages/eslint-plugin-ckeditor5-rules',
					include: [
						'tests/rules/**/*.@(js|mjs)'
					],
					setupFiles: [
						'./tests/_utils/rule-tester-setup.mjs'
					]
				}
			},
			{
				test: {
					name: 'eslint-plugin-ckeditor5-rules:utils',
					root: './packages/eslint-plugin-ckeditor5-rules',
					include: [
						'tests/_utils/**/*.test.mjs'
					]
				}
			},
			{
				test: {
					name: 'scripts',
					testTimeout: 10000,
					mockReset: true,
					restoreMocks: true,
					include: [
						'scripts-tests/**/*.@(js|mjs|cjs)'
					]
				}
			}
		],
		coverage: {
			provider: 'v8',
			include: [
				'packages/eslint-config-ckeditor5/eslint.config.mjs',
				'packages/eslint-plugin-ckeditor5-rules/lib/**',
				'scripts/**'
			],
			reporter: [ 'text-summary', 'html' ]
		}
	}
} );
