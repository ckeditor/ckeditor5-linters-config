Changelog
=========

## [5.3.2](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.3.1...v5.3.2) (2024-03-08)

### Bug fixes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Improve autofixer for `'.'` imports to prepare a relative path to the `index.js` file rather than an absolute path to the imported file. Closes [ckeditor/ckeditor5#15880](https://github.com/ckeditor/ckeditor5/issues/15880). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/e978016bc39211b7a675dda6d53a30dac369eac0))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/5.3.2): v5.3.1 => v5.3.2
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/5.3.2): v5.3.1 => v5.3.2
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/5.3.2): v5.3.1 => v5.3.2
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/5.3.2): v5.3.1 => v5.3.2
</details>


## [5.3.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.3.0...v5.3.1) (2024-03-05)

### Bug fixes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Report a missing file extension when '.' import or export is used. Fixes [[#15880](https://github.com/ckeditor/ckeditor5-linters-config/issues/15880)](https://github.com/ckeditor/ckeditor5/issues/15880). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/be3159e8b3351b992586da62359b7806277fa3b4))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Properly detect valid imports of dependencies using the `exports` field. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/be3159e8b3351b992586da62359b7806277fa3b4))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/5.3.1): v5.3.0 => v5.3.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/5.3.1): v5.3.0 => v5.3.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/5.3.1): v5.3.0 => v5.3.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/5.3.1): v5.3.0 => v5.3.1
</details>


## [5.3.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.2.1...v5.3.0) (2024-01-18)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Add a rule to enforce correct imports of the SVG icons. See [ckeditor/ckeditor5#15704](https://github.com/ckeditor/ckeditor5/issues/15704). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/1d9916643f8bdf8580ab9082e3c103d1607a8b12))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/5.3.0): v5.2.1 => v5.3.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/5.3.0): v5.2.1 => v5.3.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/5.3.0): v5.2.1 => v5.3.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/5.3.0): v5.2.1 => v5.3.0
</details>


## [5.2.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.2.0...v5.2.1) (2023-12-15)

### Other changes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Improved the `ckeditor5-rules/require-file-extensions-in-imports` to require a file extension in both imports and exports. See https://github.com/ckeditor/ckeditor5/issues/13673. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/950a842b6aaacbb7d2e958be6e1a224db755b2f5))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/5.2.1): v5.2.0 => v5.2.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/5.2.1): v5.2.0 => v5.2.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/5.2.1): v5.2.0 => v5.2.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/5.2.1): v5.2.0 => v5.2.1
</details>


## [5.2.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.1.3...v5.2.0) (2023-12-14)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added a rule requiring file extensions in imports. See [ckeditor/ckeditor5#13673](https://github.com/ckeditor/ckeditor5/issues/13673). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/d7d5211e960378b985f0383efc66951e89dfd83b))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/5.2.0): v5.1.3 => v5.2.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/5.2.0): v5.1.3 => v5.2.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/5.2.0): v5.1.3 => v5.2.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/5.2.0): v5.1.3 => v5.2.0
</details>

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
