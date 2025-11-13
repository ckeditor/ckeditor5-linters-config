/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const parser = require( '@typescript-eslint/parser' );

const ruleTester = new RuleTester( {
	languageOptions: {
		parser
	}
} );

ruleTester.run( 'enforce-node-protocol', require( '../../lib/rules/enforce-node-protocol' ), {
	valid: [
		// Already prefixed ESM.
		{
			code: 'import fs from \'node:fs\';'
		},
		{
			code: 'import * as fs from \'node:fs\';'
		},
		{
			code: 'import { readFile } from \'node:fs/promises\';'
		},
		{
			code: 'import \'node:fs\';'
		},

		// Already prefixed CommonJS.
		{
			code: 'const fs = require(\'node:fs\');'
		},
		{
			code: 'const { readFile } = require(\'node:fs/promises\');'
		},

		// Already prefixed dynamic import.
		{
			code: 'const fs = await import(\'node:fs\')'
		},
		{
			code: 'const { readFile } = await import(\'node:fs/promises\')'
		},

		// External packages should not be flagged.
		{
			code: 'import resolve from \'enhanced-resolve\';'
		},
		{
			code: 'const resolve = require(\'enhanced-resolve\');'
		},
		{
			code: 'const resolve = await import(\'enhanced-resolve\');'
		},

		// Relative and absolute paths should not be flagged.
		{
			code: 'import local from \'./relative/file.js\';'
		},
		{
			code: 'import abs from \'/abs/path/file.js\';'
		},
		{
			code: 'import packageJson from \'../package.json\' with { type: \'json\' };'
		},
		{
			code: 'const local = require(\'../relative/file.js\');'
		},
		{
			code: 'const abs = require(\'/abs/path/file.js\');'
		},
		{
			code: 'const packageJson = require(\'../package.json\');'
		},
		{
			code: 'const local = await import(\'./relative/file.js\')'
		},
		{
			code: 'const abs = await import(\'/abs/path/file.js\')'
		},
		{
			code: 'const packageJson = await import(\'../package.json\', { with: { type: \'json\' } })'
		},

		// Non-literal require() (cannot be safely analyzed).
		{
			code: 'const name = \'fs\'; const fs = require(name);'
		},

		// Non-literal dynamic import() (cannot be safely analyzed).
		{
			code: 'const name = \'fs\'; const fs = await import(name);'
		},

		// Re-export
		{
			code: 'export { readFile } from \'node:fs/promises\';'
		},

		// Should not fail when there is no "from" in export.
		{
			code: 'const test = 123; export { test };'
		}
	],

	invalid: [
		// ESM: default import.
		{
			code: 'import fs from \'fs\';',
			output: 'import fs from \'node:fs\';',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		},

		// ESM: namespace import.
		{
			code: 'import * as fs from \'fs\';',
			output: 'import * as fs from \'node:fs\';',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		},

		// ESM: named import.
		{
			code: 'import { readFile } from \'fs\';',
			output: 'import { readFile } from \'node:fs\';',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		},

		// ESM: side-effect import.
		{
			code: 'import \'fs\';',
			output: 'import \'node:fs\';',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		},

		// CommonJS require.
		{
			code: 'const fs = require(\'fs\');',
			output: 'const fs = require(\'node:fs\');',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		},

		// Dynamic ESM import.
		{
			code: 'const fs = await import(\'fs\')',
			output: 'const fs = await import(\'node:fs\')',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		},

		// ESM: Re-export
		{
			code: 'export { readFile } from \'fs\';',
			output: 'export { readFile } from \'node:fs\';',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		},

		// CJS: Re-export
		{
			code: 'module.exports = require(\'fs\');',
			output: 'module.exports = require(\'node:fs\');',
			errors: [
				'Use \'node:\' prefix for built-in module \'fs\'.'
			]
		}
	]
} );
