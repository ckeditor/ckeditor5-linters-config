/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	extends: 'ckeditor5',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	env: {
		node: true
	},
	ignorePatterns: [ '**/coverage/**' ],
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
};
