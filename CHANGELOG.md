Changelog
=========

## [10.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v9.1.0...v10.0.0-alpha.0) (2025-05-13)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: The configuration exported from `eslint-config-ckeditor5` package is now in ESM format.
* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: The `ckeditor5-rules/no-build-extensions` rule is no longer included in the configuration.
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Removed the `ckeditor5-rules/no-build-extensions` rule due to the removal of predefined builds.
* The minimal ESLint version supported by the `eslint-config-ckeditor5` and `eslint-plugin-ckeditor5-rules` packages has been set to v9.x. See [ESLint migration guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0) for details.

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Aligned ESLint configuration to be compatible with ESLint v9.x. Closes [ckeditor/ckeditor5#18495](https://github.com/ckeditor/ckeditor5/issues/18495). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/fb6e6f13b626a098bba4e65a8cde3ed26f4daf6b))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Aligned ESLint rules to be compatible with ESLint v9.x. Closes [ckeditor/ckeditor5#18496](https://github.com/ckeditor/ckeditor5/issues/18496). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/fb6e6f13b626a098bba4e65a8cde3ed26f4daf6b))
* The `ckeditor5-rules/no-build-extensions` is no longer available. Read more details in [ckeditor/ckeditor5#17779](https://github.com/ckeditor/ckeditor5/issues/17779). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/08c01f65535abf818d29df7d07de2dbcd0079f96))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/10.0.0-alpha.0): v9.1.0 => v10.0.0-alpha.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/10.0.0-alpha.0): v9.1.0 => v10.0.0-alpha.0

Other releases:

* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/10.0.0-alpha.0): v9.1.0 => v10.0.0-alpha.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/10.0.0-alpha.0): v9.1.0 => v10.0.0-alpha.0
</details>


## [9.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v9.0.0...v9.1.0) (2025-02-13)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Add the `allow-svg-imports-only-in-icons-package` rule. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/fd10b81cf877684b65cfaf0ad77e7fdfd2b4dd2f))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/9.1.0): v9.0.0 => v9.1.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/9.1.0): v9.0.0 => v9.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/9.1.0): v9.0.0 => v9.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/9.1.0): v9.0.0 => v9.1.0
</details>


## [9.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v8.0.0...v9.0.0) (2025-01-08)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* The watchdog package is now added to the list of core DLL packages in `ckeditor-imports` rule.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Add watchdog to the list of core DLL packages in `ckeditor-imports` rule. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/f97b54a91cb8ffd1513983a6874825979e2b1338))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Ignore type imports in `no-cross-package-imports` rule. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/f97b54a91cb8ffd1513983a6874825979e2b1338))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/9.0.0): v8.0.0 => v9.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/9.0.0): v8.0.0 => v9.0.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/9.0.0): v8.0.0 => v9.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/9.0.0): v8.0.0 => v9.0.0
</details>


## [8.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v7.1.1...v8.0.0) (2024-10-15)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* Defining `isOfficialPlugin` and `isPremiumPlugin` flags in plugins is no longer allowed, as they are now restricted to internal use only.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Add the `ckeditor5/ckeditor-plugin-flags` rule that disallows creating certain flags in plugins and enforces proper code style for allowed ones. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/bdc3234706a406af5e813169f2aa56b67b4e9e3b))
* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Disallow defining `isOfficialPlugin` and `isPremiumPlugin` flags in plugins, restricting them to internal use only. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/bdc3234706a406af5e813169f2aa56b67b4e9e3b))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/8.0.0): v7.1.1 => v8.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/8.0.0): v7.1.1 => v8.0.0

Other releases:

* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/8.0.0): v7.1.1 => v8.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/8.0.0): v7.1.1 => v8.0.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
