CKEditor 5 ESLint preset
========================

[![npm version](https://badge.fury.io/js/eslint-config-ckeditor5.svg)](https://www.npmjs.com/package/eslint-config-ckeditor5)
![Dependency Status](https://img.shields.io/librariesio/release/npm/eslint-config-ckeditor5)

## Usage

```
npm i --save-dev eslint-config-ckeditor5
```

[Configure ESLint](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file) using the following contents:

```js
import { defineConfig } from 'eslint/config';
import ckeditor5Config from 'eslint-config-ckeditor5';

export default defineConfig( [
	{
		extends: ckeditor5Config
	}
] );
```
