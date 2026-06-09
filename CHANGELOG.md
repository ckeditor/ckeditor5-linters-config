Changelog
=========

## [16.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v15.1.0...v16.0.0) (June 9, 2026)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Updated the `@stylistic/no-multiple-empty-lines` rule in default config to enforce a single empty line at the beginning and end of files. Closes [ckeditor/ckeditor5-internal#4485](https://github.com/ckeditor/ckeditor5-internal/issues/4485).
* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: The CSS preset now enables `@eslint/css` validation rules for all CSS files: `no-duplicate-imports`, `no-duplicate-keyframe-selectors`, `no-empty-blocks`, `no-invalid-at-rule-placement`, `no-invalid-at-rules`, `no-invalid-named-grid-areas`, `no-unmatchable-selectors`, `selector-complexity`, `prefer-logical-properties`, and `use-baseline` with `{ available: 'widely' }`. It also enables `ckeditor5-rules/css-indent` and `ckeditor5-rules/no-disallowed-color-formats` for all CSS files, and `ckeditor5-rules/ck-content-variable-name` for `**/theme/**/*.css`.

  The preset enables `ckeditor5-rules/ck-content-variable-name` with no options, so it has no built-in exemptions. Consumers that previously relied on the old Stylelint `-suggestion-` and `-comment-` exemptions, for example `var(--ck-suggestion-marker)` inside a `.ck-content` selector, must configure `ignoredVariableSubstrings` or rename the affected variables to use the `--ck-content-*` prefix.
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `ckeditor5-rules/require-as-const-returns-in-methods` rule now checks only the `pluginName` method.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added a new `ckeditor5-rules/css-indent` rule that enforces tab indentation in CSS files. The rule checks indentation in nested blocks and multi-line parenthesized values, and can automatically fix reported indentation issues.
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added a new `ckeditor5-rules/no-disallowed-color-formats` rule for CSS files. The rule rejects hex colors, `rgb()` and `rgba()` calls, and named CSS colors. Use HSL or CSS custom properties instead.
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added a new `ckeditor5-rules/ck-content-variable-name` rule for CSS files. The rule requires variables used inside `.ck-content` selectors to use the `--ck-content-*` prefix. Exemptions can be configured with the `ignoredVariableSubstrings` option.
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Extended `ckeditor5-rules/license-header` to validate CSS files. Missing, incorrect, or incorrectly positioned CSS license headers are reported and can be automatically fixed.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/16.0.0): v15.1.0 => v16.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/16.0.0): v15.1.0 => v16.0.0
</details>


## [15.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v15.0.0...v15.1.0) (May 5, 2026)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added two ESLint rules that flag implicit `$root` schema-context usage: `ckeditor5-rules/no-literal-dollar-root` (disallows hardcoded `'$root'` literals outside engine/core) and `ckeditor5-rules/require-explicit-data-context` (requires an explicit context argument on `data.parse()`, `data.toModel()`, `model.document.createRoot()`, `writer.addRoot()`, and `upcastDispatcher.convert()` calls). See [ckeditor/ckeditor5#20026](https://github.com/ckeditor/ckeditor5/issues/20026). Closes [ckeditor/ckeditor5#20096](https://github.com/ckeditor/ckeditor5/issues/20096).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/15.1.0): v15.0.0 => v15.1.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/15.1.0): v15.0.0 => v15.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/15.1.0): v15.0.0 => v15.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/15.1.0): v15.0.0 => v15.1.0
</details>


## [15.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v14.1.0...v15.0.0) (April 17, 2026)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Enabled the new `ckeditor5-rules/no-enum` rule. Enums are now disallowed by default.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added a new `ckeditor5-rules/no-enum` rule. It disallows usage of typescript Enums.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/15.0.0): v14.1.0 => v15.0.0

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/15.0.0): v14.1.0 => v15.0.0

Other releases:

* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/15.0.0): v14.1.0 => v15.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/15.0.0): v14.1.0 => v15.0.0
</details>


## [14.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v14.0.0...v14.1.0) (April 9, 2026)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `validate-module-tag` ESLint rule to verify that file-level `@module` tags match TypeScript source file paths, including accepted aliases for `index.ts` files.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/14.1.0): v14.0.0 => v14.1.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/14.1.0): v14.0.0 => v14.1.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/14.1.0): v14.0.0 => v14.1.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/14.1.0): v14.0.0 => v14.1.0
</details>


## [14.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v13.0.0...v14.0.0) (March 16, 2026)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Removed the `ckeditor-imports` ESLint rule that was used for DLL import linting.
* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Removed `no-legacy-imports` ESLint rule as it is no longer needed since DLL support has been dropped. Closes [ckeditor/ckeditor5#19522](https://github.com/ckeditor/ckeditor5/issues/19522).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/14.0.0): v13.0.0 => v14.0.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/14.0.0): v13.0.0 => v14.0.0
* [stylelint-config-ckeditor5](https://www.npmjs.com/package/stylelint-config-ckeditor5/v/14.0.0): v13.0.0 => v14.0.0
* [stylelint-plugin-ckeditor5-rules](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules/v/14.0.0): v13.0.0 => v14.0.0
</details>

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
