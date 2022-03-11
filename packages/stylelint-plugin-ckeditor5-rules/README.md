CKEditor 5 Stylelint Plugins
=========================

TBA badges

A set of plugins used by the [CKEditor 5](https://ckeditor.com) team for [Stylelint](https://stylelint.io/)

By default this plugin is added to our [`stylelint-config-ckeditor5`](https://www.npmjs.com/package/stylelint-config-ckeditor5) preset.

## Usage

```
npm i --save-dev stylelint-plugin-ckeditor5-rules
```

Configure Stylelint with a `.stylelintrc` file using the following contents:

```json
{
	// ...
	"plugins": [
		// ...
		"./lib/rules/license-header.js" // Add the plugin to the linter.
	],
	"rules": {
		"ckeditor5-plugin/license-header": [ true, {
			"headerContent": [
				" * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.",
				" * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license"
			]
		} ]
		// ...
	}
	// ...
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
			' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
			' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
			' */'
		]
	} ]
}
```
