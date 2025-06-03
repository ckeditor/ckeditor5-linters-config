Changelog
=========

## [11.0.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v11.0.0...v11.0.1) (2025-06-03)

### Other changes

* Upgraded to Stylelint v16.x to resolve issues related to ESM and CJS compatibility. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/54e6c146b97b70e2142de9e376c875cb8d2cf691))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/11.0.1): v11.0.0 => v11.0.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/11.0.1): v11.0.0 => v11.0.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/11.0.1): v11.0.0 => v11.0.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/11.0.1): v11.0.0 => v11.0.1
</details>


## [11.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v10.0.0...v11.0.0) (2025-06-03)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* The minimal Stylelint version supported by the `stylelint-config-ckeditor5` and `stylelint-plugin-ckeditor5-rules` packages has been set to v15.x.

### Other changes

* The minimal Stylelint version supported by the `stylelint-config-ckeditor5` and `stylelint-plugin-ckeditor5-rules` packages has been set to v15.x. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/63219063b4ade6e5347140dfa33388c6ff7b4ec3))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/11.0.0): v10.0.0 => v11.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/11.0.0): v10.0.0 => v11.0.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/11.0.0): v10.0.0 => v11.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/11.0.0): v10.0.0 => v11.0.0
</details>


## [10.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v9.1.0...v10.0.0) (2025-05-26)

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

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/10.0.0): v9.1.0 => v10.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/10.0.0): v9.1.0 => v10.0.0

Other releases:

* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/10.0.0): v9.1.0 => v10.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/10.0.0): v9.1.0 => v10.0.0
</details>


## [10.0.0-alpha.3](https://github.com/ckeditor/ckeditor5-linters-config/compare/v10.0.0-alpha.2...v10.0.0-alpha.3) (2025-05-14)

Internal changes only (updated dependencies, documentation, etc.).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/10.0.0-alpha.3): v10.0.0-alpha.2 => v10.0.0-alpha.3
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/10.0.0-alpha.3): v10.0.0-alpha.2 => v10.0.0-alpha.3
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/10.0.0-alpha.3): v10.0.0-alpha.2 => v10.0.0-alpha.3
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/10.0.0-alpha.3): v10.0.0-alpha.2 => v10.0.0-alpha.3
</details>


## [10.0.0-alpha.2](https://github.com/ckeditor/ckeditor5-linters-config/compare/v10.0.0-alpha.1...v10.0.0-alpha.2) (2025-05-14)

Internal changes only (updated dependencies, documentation, etc.).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/10.0.0-alpha.2): v10.0.0-alpha.1 => v10.0.0-alpha.2
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/10.0.0-alpha.2): v10.0.0-alpha.1 => v10.0.0-alpha.2
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/10.0.0-alpha.2): v10.0.0-alpha.1 => v10.0.0-alpha.2
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/10.0.0-alpha.2): v10.0.0-alpha.1 => v10.0.0-alpha.2
</details>

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
