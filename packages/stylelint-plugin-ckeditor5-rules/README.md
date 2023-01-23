CKEditor 5 Stylelint plugins
============================

[![npm version](https://badge.fury.io/js/stylelint-plugin-ckeditor5-rules.svg)](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules)
![Dependency Status](https://img.shields.io/librariesio/release/npm/stylelint-plugin-ckeditor5-rules)

A set of plugins used by the [CKEditor 5](https://ckeditor.com) team for [Stylelint](https://stylelint.io/)

By default this plugin is added to our [`stylelint-config-ckeditor5`](https://www.npmjs.com/package/stylelint-config-ckeditor5) preset.

## Usage

```
npm i --save-dev stylelint-plugin-ckeditor5-rules
```

Add the plugin to a `.stylelintrc` file, then configure available rules.

```json
{
	"plugins": [
		"stylelint-plugin-ckeditor5-rules/lib/license-header"
	]
}
```

## Rules

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
