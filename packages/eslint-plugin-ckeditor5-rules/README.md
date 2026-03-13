CKEditor 5 ESLint plugins
=========================

[![npm version](https://badge.fury.io/js/eslint-plugin-ckeditor5-rules.svg)](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)
![Dependency Status](https://img.shields.io/librariesio/release/npm/eslint-plugin-ckeditor5-rules)

A set of plugins used by the [CKEditor 5](https://ckeditor.com) team for [Eslint](https://eslint.org/)

By default this plugin is added to our [`eslint-config-ckeditor5`](https://www.npmjs.com/package/eslint-config-ckeditor5) preset.

## Usage

```
npm i --save-dev eslint-plugin-ckeditor5-rules
```

[Configure ESLint](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file) using the following contents:

```js
import { defineConfig } from 'eslint/config';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';

export default defineConfig( [
	{
		plugins: {
			'ckeditor5-rules': ckeditor5Rules
		},
		rules: {
			'ckeditor5-rules/no-relative-imports': 'error',
			'ckeditor5-rules/license-header': [ 'error', {
				headerLines: [
					'/**',
					' * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.',
					' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
					' */'
				]
			} ]
			// ...
		}
		// ...
	}
] );
```

## Rules

The list of all ESLint rules published in `eslint-plugin-ckeditor5-rules` package is documented on https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#ckeditor-5-custom-eslint-rules.
