Changelog
=========

## [4.1.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.1.0...v4.1.1) (2022-11-14)

### Other changes

* Disables the `new-cap` rule. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/9d0b682f24ef6bbd283d021871cd02a8d511c320))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.1.0 => v4.1.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.1.0 => v4.1.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.1.0 => v4.1.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.1.0 => v4.1.1
</details>


## [4.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.0.2...v4.1.0) (2022-11-04)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Created a new ESLint rule that disables using the `import` statement and `CK_DEBUG_*` flags together due to a webpack error (`'import' and 'export' may only appear at the top level`). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/7996055efc698abcb23ad7feca30bd39821cded4))

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Enabled the `ckeditor5-rules/use-require-for-debug-mode-imports` rule in the ESLint configuration. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/7996055efc698abcb23ad7feca30bd39821cded4))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.0.2 => v4.1.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.0.2 => v4.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.0.2 => v4.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.0.2 => v4.1.0
</details>


## [4.0.2](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.0.1...v4.0.2) (2022-10-17)

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Adds `array-type` rule. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/4cb78a9d1bf7cf449d65c4df18b0f2078ebec6bb))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.0.1 => v4.0.2
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.0.1 => v4.0.2
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.0.1 => v4.0.2
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.0.1 => v4.0.2
</details>


## [4.0.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.0.0...v4.0.1) (2022-06-08)

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Adds rules and support for TypeScript. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/98c8b7d46a432a4efbfbb567d4519e526777301a))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.0.0 => v4.0.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.0.0 => v4.0.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.0.0 => v4.0.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.0.0 => v4.0.1
</details>


## [4.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v0.0.1...v4.0.0) (2022-03-15)

Due to migration to the mono-repository, packages hosted in the repository follow [the CKEditor 5 Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html).

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* Upgraded the minimal versions of Node.js to `14.0.0` due to the end of LTS.

### Features

* **[stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules)**: Introduced a new package containing a plugin for checking the license headers in `*.css` files. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/6528c230216864dc99a79a7ab8ff1b37ce411bcd))

### Other changes

* **[stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5)**: Added the `stylelint-plugin-ckeditor5-rules/lib/license-header` plugin to the configuration. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/6528c230216864dc99a79a7ab8ff1b37ce411bcd))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

New packages:

* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.0.0

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v1.3.0 => v4.0.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v2.0.1 => v4.0.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v3.1.1 => v4.0.0
</details>
