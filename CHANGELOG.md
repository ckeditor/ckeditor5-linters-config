Changelog
=========

## [5.1.2](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.1.1...v5.1.2) (2023-10-20)

### Other changes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Upgrade the `@es-joy/jsdoccomment` package to its latest version to make the CKEditor 5 compatible with Node@20. Closes [ckeditor/ckeditor5#15203](https://github.com/ckeditor/ckeditor5/issues/15203). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/cc93260dd7aa17ddbe79cb6f4dbe1c1cd6a3157e))
* Updated the required version of Node.js to 18 when developing the repository. See [ckeditor/ckeditor5#14924](https://github.com/ckeditor/ckeditor5/issues/14924). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/7852374add49fe23c9f7a436d7f119b35f5c6aa0))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/5.1.2): v5.1.1 => v5.1.2
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/5.1.2): v5.1.1 => v5.1.2
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/5.1.2): v5.1.1 => v5.1.2
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/5.1.2): v5.1.1 => v5.1.2
</details>


## [5.1.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.1.0...v5.1.1) (2023-07-13)

### Bug fixes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Use `ckeditor5-rules` only for source code, not tests. See [ckeditor/ckeditor5#14451](https://github.com/ckeditor/ckeditor5/issues/14451). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/ff8038d3149790740413bcafda8c39dc4ca69a7b))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v5.1.0 => v5.1.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v5.1.0 => v5.1.1
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v5.1.0 => v5.1.1
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v5.1.0 => v5.1.1
</details>


## [5.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v5.0.1...v5.1.0) (2023-06-19)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Created the `ckeditor5-rules/no-scoped-imports-within-package` that disallows using scoped import (like `"@ckeditor/ckeditor5-*"`) to the same package where the import declaration is located. Closes [ckeditor/ckeditor5#14329](https://github.com/ckeditor/ckeditor5/issues/14329). ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/af2205c8cd7b726c3fdb59c7e838521afbf108e8))

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Enabled the `ckeditor5-rules/no-scoped-imports-within-package` in the ESLint configuration. ([commit](https://github.com/ckeditor/ckeditor5-linters-config/commit/af2205c8cd7b726c3fdb59c7e838521afbf108e8))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5): v5.0.1 => v5.1.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules): v5.0.1 => v5.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5): v5.0.1 => v5.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules): v5.0.1 => v5.1.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
