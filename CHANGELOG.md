Changelog
=========

## [12.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v12.0.0...v12.1.0) (July 24, 2025)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added code fixer for `ckeditor5-rules/allow-imports-only-from-main-package-entry-point`. Closes [ckeditor/ckeditor5#18857](https://github.com/ckeditor/ckeditor5/issues/18857).

### Bug fixes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Fixed the `ckeditor5-rules/ckeditor-imports` rule detecting errors for imports that do not start with `ckeditor5`.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/12.1.0): v12.0.0 => v12.1.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/12.1.0): v12.0.0 => v12.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/12.1.0): v12.0.0 => v12.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/12.1.0): v12.0.0 => v12.1.0
</details>


## [12.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v11.1.0...v12.0.0) (July 11, 2025)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5)**: Added a new rule: `ckeditor5-rules/ck-content-variable-name` (enabled by default). It enforces that all CSS variables used within the `.ck-content` selectors follow the `--ck-content-*` naming convention. This ensures consistent and scoped variable usage inside the editor content styles. Closes [ckeditor/ckeditor5#18805](https://github.com/ckeditor/ckeditor5/issues/18805).
* **[stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules)**: The way how the rules from the `stylelint-plugin-ckeditor5-rules` package are loaded has been changed. See [ckeditor/ckeditor5#18805](https://github.com/ckeditor/ckeditor5/issues/18805).

  Previously, each rule had to be imported in Stylelint config directly:

  ```
  "plugins": [
      "stylelint-plugin-ckeditor5-rules/lib/license-header"
  ],
  ```

  Now, the package exports all the rules, so it can be loaded instead of providing each rule separately:

  ```
  "plugins": [
    "stylelint-plugin-ckeditor5-rules"
  ],
  ```

  The way rules are configured remains unchanged:

  ```
  "rules": {
    "ckeditor5-rules/license-header": [ ... ]
  }
  ```

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/12.0.0): v11.1.0 => v12.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/12.0.0): v11.1.0 => v12.0.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/12.0.0): v11.1.0 => v12.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/12.0.0): v11.1.0 => v12.0.0
</details>


## [11.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v11.0.1...v11.1.0) (July 10, 2025)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Add the `validate-changelog-entry` rule for validating Markdown-based changelog entries. Closes [ckeditor/ckeditor5#18777](https://github.com/ckeditor/ckeditor5/issues/18777).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/11.1.0): v11.0.1 => v11.1.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/11.1.0): v11.0.1 => v11.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/11.1.0): v11.0.1 => v11.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/11.1.0): v11.0.1 => v11.1.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
