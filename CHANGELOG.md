Changelog
=========

## [5.0.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.0.0...v5.0.1) (2023-06-07)

### Bug fixes

* Fixed versions of dependencies in the repository due to missing update phase while preparing packages to release. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/f72aa1902ff4ee8ae391d9ca6178adc8052cb06c))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v5.0.0 => v5.0.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v5.0.0 => v5.0.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v5.0.0 => v5.0.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v5.0.0 => v5.0.1
</details>


## [5.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.4.0...v5.0.0) (2023-06-07)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Created the `ckeditor5-rules/no-istanbul-in-debug-code` plugin that disallows using the `@if CK_DEBUG_*` and `istanbul` keywords in the same line. Related to [ckeditor/ckeditor5#13922](https://github.com/ckeditor/ckeditor5/issues/13922). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/7d754ae2e77a1e596d79de5d48ba608d287ce0f7))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Created the `ckeditor5-rules/allow-declare-module-only-in-augmentation-file` plugin that enforces using module augmentation for the `@ckeditor/ckeditor5-core` modules only in the augmentation files. Related to [ckeditor/ckeditor5#13434](https://github.com/ckeditor/ckeditor5/issues/13434). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/1bdcbaa3a69032d8814ef2dc77afd4a1c57f1f24))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Created the `ckeditor5-rules/allow-imports-only-from-main-package-entry-point` plugin that allows imports from the `@ckeditor/*` modules only from the main package entry point. Related to [ckeditor/ckeditor5#13434](https://github.com/ckeditor/ckeditor5/issues/13434). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/1bdcbaa3a69032d8814ef2dc77afd4a1c57f1f24))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Created the `ckeditor5-rules/require-as-const-returns-in-methods` plugin that enforces using the `as const` in return statements for `requires` and `pluginName` methods. Related to [ckeditor/ckeditor5#13434](https://github.com/ckeditor/ckeditor5/issues/13434). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/1bdcbaa3a69032d8814ef2dc77afd4a1c57f1f24))
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added fixer for the `license-header` rule. Closes [ckeditor/ckeditor5#11473](https://github.com/ckeditor/ckeditor5/issues/11473). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/2873ecc10b8214131d1fe7121f0de9e9c05a9a74))

### Bug fixes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Run some TypeScript-specific rules only against `.ts(x)` files. See [ckeditor/ckeditor5#13434](https://github.com/ckeditor/ckeditor5/issues/13434). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/e6c778ad1afaf41a097346a4529f9353f39f2662))

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Enabled the `ckeditor5-rules/no-istanbul-in-debug-code` in the ESLint configuration. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/7d754ae2e77a1e596d79de5d48ba608d287ce0f7))
* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Enabled the `ckeditor5-rules/allow-declare-module-only-in-augmentation-file` in the ESLint configuration. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/1bdcbaa3a69032d8814ef2dc77afd4a1c57f1f24))
* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Enabled the `ckeditor5-rules/allow-imports-only-from-main-package-entry-point` in the ESLint configuration. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/1bdcbaa3a69032d8814ef2dc77afd4a1c57f1f24))
* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Enabled the `ckeditor5-rules/require-as-const-returns-in-methods` in the ESLint configuration. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/1bdcbaa3a69032d8814ef2dc77afd4a1c57f1f24))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.4.0 => v5.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.4.0 => v5.0.0

Other releases:

* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.4.0 => v5.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.4.0 => v5.0.0
</details>


## [4.4.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.3.0...v4.4.0) (2023-03-30)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Created the `ckeditor5-rules/no-build-extensions` plugin that disallows extending a CKEditor 5 build. Closes [ckeditor/ckeditor5#13689](https://github.com/ckeditor/ckeditor5/issues/13689). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/e1a43276ab521c5f32f8046645b9a8b6e99ae365))

### Other changes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added URLs for rule definitions at which the full documentation can be accessed. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/e1a43276ab521c5f32f8046645b9a8b6e99ae365))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.3.0 => v4.4.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.3.0 => v4.4.0

Other releases:

* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.3.0 => v4.4.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.3.0 => v4.4.0
</details>


## [4.3.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.2.1...v4.3.0) (2023-03-29)

### Features

* Add support for linting `.tsx` files. Related to [ckeditor/ckeditor5#13542](https://github.com/ckeditor/ckeditor5/issues/13542). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/02be5fa35b3555357e02b1df54afdfe674f2602e))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.2.1 => v4.3.0

Other releases:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.2.1 => v4.3.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.2.1 => v4.3.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.2.1 => v4.3.0
</details>


## [4.2.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v4.2.0...v4.2.1) (2023-03-28)

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Allow 'requires' methods not to specify a return type. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/bb98cd58b2973179bbc2a13b2d1425140f97c94c))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v4.2.0 => v4.2.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v4.2.0 => v4.2.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v4.2.0 => v4.2.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v4.2.0 => v4.2.1
</details>

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
