Changelog
=========

## [7.1.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v7.1.0...v7.1.1) (2024-10-02)

Internal changes only (updated dependencies, documentation, etc.).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/7.1.1): v7.1.0 => v7.1.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/7.1.1): v7.1.0 => v7.1.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/7.1.1): v7.1.0 => v7.1.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/7.1.1): v7.1.0 => v7.1.1
</details>


## [7.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v7.0.0...v7.1.0) (2024-09-23)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `prevent-license-key-leak` rule. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/8840c209fd8e6e716eeaf856c08ab3eb50bc66ec))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/7.1.0): v7.0.0 => v7.1.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/7.1.0): v7.0.0 => v7.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/7.1.0): v7.0.0 => v7.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/7.1.0): v7.0.0 => v7.1.0
</details>


## [7.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v6.0.0...v7.0.0) (2024-09-04)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Enable 'no-unused-vars' rule. See [ckeditor/ckeditor5#17010](https://github.com/ckeditor/ckeditor5/issues/17010). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/0145f1b04c821bcab5c1ed7546f13f1206cd4f87))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/7.0.0): v6.0.0 => v7.0.0

Other releases:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/7.0.0): v6.0.0 => v7.0.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/7.0.0): v6.0.0 => v7.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/7.0.0): v6.0.0 => v7.0.0
</details>


## [6.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.3.2...v6.0.0) (2024-06-18)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Removed the `ckeditor5-rules/no-cross-package-svg-imports` rule, as it does the same thing as the updated `allow-imports-only-from-main-package-entry-point` rule.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `ckeditor5-rules/no-legacy-imports` rule to detect and fix imports used in the old installation methods. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/848ae15fd31ce907b6fa7ea6cbf3cb5827326851))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `ckeditor5-rules/allow-imports-only-from-main-package-entry-point` rule should disallow importing from any path other than the package main entry point. Closes [ckeditor/ckeditor5#16559](https://github.com/ckeditor/ckeditor5/issues/16559). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/848ae15fd31ce907b6fa7ea6cbf3cb5827326851))

### Bug fixes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Fix `ckeditor5-rules/require-file-extensions-in-imports` rule for packages with `exports` that do not automatically add file extension. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/848ae15fd31ce907b6fa7ea6cbf3cb5827326851))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Minor releases (contain minor breaking changes):

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/6.0.0): v5.3.2 => v6.0.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/6.0.0): v5.3.2 => v6.0.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/6.0.0): v5.3.2 => v6.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/6.0.0): v5.3.2 => v6.0.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
