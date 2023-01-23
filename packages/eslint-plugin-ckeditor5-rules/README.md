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

Configure ESLint with a `.eslintrc` file using the following contents:

```js
{
	// ...
	plugins: [
		// ...
		'ckeditor5-rules' // Add the plugin to the linter.
	],
	rules: {
		'ckeditor5-rules/no-relative-imports': 'error',
		'ckeditor5-rules/license-header': [ 'error', {
			headerLines: [
				'/**',
				' * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			]
		} ]
		// ...
	}
	// ...
}
```

## Rules

### no-relative-imports

A rule that inspects for relative imports to other [CKEditor 5](https://ckeditor.com)'s packages:

```js
// Incorrect import:
import Position from '../../ckeditor5-engine/src/model/position';

// Will be fixed to:
import Position from '@ckeditor/ckeditor5-engine/src/model/position';
```

### license-header

This rule checks if each file starts with proper `@license` block comment. It requires configuration:

```js
rules: {
	'ckeditor5-rules/license-header': [ 'error', {
		headerLines: [
			'/**',
			' * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.',
			' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
			' */'
		]
	} ]
}
```
