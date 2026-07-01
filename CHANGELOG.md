Changelog
=========

## [17.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v16.1.0...v17.0.0) (July 1, 2026)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5), [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `ckeditor5-rules/use-require-for-debug-mode-imports` ESLint rule has been removed. Debug mode imports (for example, `// [@if](https://github.com/if) CK_DEBUG // ...`) can now use the standard `import` syntax, because both the webpack-based and the Vite-based manual test servers handle the uncommented `import` statements correctly. The rule is no longer registered by `eslint-plugin-ckeditor5-rules` and is no longer enabled by `eslint-config-ckeditor5`.

### Bug fixes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `ckeditor5-rules/require-file-extensions-in-imports` rule no longer crashes when an import points to a subpath that is not registered in the target package's `exports` field. Such imports are now reported as a regular missing file extension error. Closes [ckeditor/ckeditor5#20197](https://github.com/ckeditor/ckeditor5/issues/20197).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Minor releases (contain minor breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/17.0.0): v16.1.0 => v17.0.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/17.0.0): v16.1.0 => v17.0.0
</details>


## [16.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v16.0.0...v16.1.0) (June 26, 2026)

### Other changes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `allow-imports-only-from-main-package-entry-point` ESLint rule now allows imports from explicitly exported package subpaths declared in `package.json`.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/16.1.0): v16.0.0 => v16.1.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/16.1.0): v16.0.0 => v16.1.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
