Changelog
=========

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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
