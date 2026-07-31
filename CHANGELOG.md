Changelog
=========

## [20.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v19.1.0...v20.0.0) (July 31, 2026)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Removed the Mocha-era test linting setup: the `eslint-plugin-mocha` plugin with all `mocha/*` rules, and the Chai, Mocha, and Sinon globals injected into test files. Test files now receive the Vitest globals instead. Projects that still run Mocha-based tests must configure `eslint-plugin-mocha` on their own.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/20.0.0): v19.1.0 => v20.0.0

Other releases:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/20.0.0): v19.1.0 => v20.0.0
</details>


## [19.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v19.0.0...v19.1.0) (July 30, 2026)

### Features

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5), [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `allow-imports-only-from-main-package-entry-point` rule now accepts the `allowedImportPatterns` option: an array of glob patterns matched against the import path. Imports matching any of these patterns are allowed. It defaults to `[ '**/tests/**/_utils*/**' ]`, which preserves the previous behavior of allowing test utility imports.

  The shared `eslint-config-ckeditor5` preset now also allows importing utilities from the `manual/` directories of packages.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/19.1.0): v19.0.0 => v19.1.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/19.1.0): v19.0.0 => v19.1.0
</details>


## [19.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v18.1.0...v19.0.0) (July 22, 2026)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: The CSS preset now enables the `ckeditor5-rules/content-styles-in-index-content` and `ckeditor5-rules/no-editor-styles-in-index-content` rules as errors for `**/theme/**/*.css` files. Packages that keep content styles (selectors rooted at `.ck-content`) outside `theme/index-content.css`, or editor styles inside it, must move those styles to the matching entry point.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added two CSS rules supporting the split of package themes into editor and content stylesheets: `ckeditor5-rules/content-styles-in-index-content` requires content styles (selectors rooted at `.ck-content`) to live in `theme/index-content.css`, and `ckeditor5-rules/no-editor-styles-in-index-content` disallows editor styles in that file.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/19.0.0): v18.1.0 => v19.0.0

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/19.0.0): v18.1.0 => v19.0.0
</details>


## [18.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v18.0.0...v18.1.0) (July 22, 2026)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: The CSS configuration now enables three additional rules as errors: `css/no-important`, `ckeditor5-rules/no-descending-specificity`, and `ckeditor5-rules/no-missing-var-function`.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `ckeditor5-rules/no-descending-specificity` CSS rule. It reports selectors with lower specificity placed after overriding selectors with higher specificity that target the same element, since such selectors cannot win the cascade where both apply.

  Selectors are compared only within the same context (the same nesting parent and at-rule conditions) and only when they share the same key selector (the last compound selector, ignoring pseudo-classes - for example, `a:hover` and `a` are compared, while `a::before` is not compared with `a`).
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `ckeditor5-rules/no-missing-var-function` CSS rule. It reports custom property references used as declaration values without the `var()` function, for example `color: --brand` instead of `color: var(--brand)`, including the `--x: --y` case inside custom property values.

  Properties whose values legitimately contain dashed identifiers are not checked - transition targets (`transition`, `transition-property`, `will-change`) and the naming properties of anchor positioning, scroll-driven animations, and view transitions (for example, `anchor-name` or `view-transition-name`). Bare references inside `var()` fallbacks, for example `var(--a, --b)`, are also reported.
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `ckeditor5-rules/no-shadow-unsafe-dom-apis` ESLint rule, which flags DOM APIs that do not work correctly inside a Shadow DOM (e.g. `document.activeElement`, `document.body.contains(...)`, global `getSelection()`, raw `.parentNode` traversal).

### Bug fixes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Widened the `typescript` peer dependency range from the exact `5.5.4` to `^5.5.4`, so the shared configuration no longer reports a peer dependency mismatch in projects using a newer TypeScript 5.x release (for example Angular projects on TypeScript 5.8), while keeping `5.5.4` as the minimum supported and tested version. The exact version remains pinned as a dev dependency for building and testing.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Minor releases (contain minor breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/18.1.0): v18.0.0 => v18.1.0

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/18.1.0): v18.0.0 => v18.1.0
</details>


## [18.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v17.1.1...v18.0.0) (July 17, 2026)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5), [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Upgraded ESLint to v10. The shared configuration and rules plugin now require `eslint@^10.0.0` and no longer support ESLint 9. Consequently, they require Node.js `^20.19.0 || ^22.13.0 || >=24` (as mandated by ESLint 10) and only support the flat configuration format.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/18.0.0): v17.1.1 => v18.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/18.0.0): v17.1.1 => v18.0.0
</details>

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
