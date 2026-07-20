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
					name: 'rules',
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
					name: 'utils',
					include: [
						'tests/_utils/**/*.test.mjs'
					]
				}
			}
		]
	}
} );
