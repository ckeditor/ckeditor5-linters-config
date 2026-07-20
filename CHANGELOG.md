Changelog
=========

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


## [17.1.1](https://github.com/ckeditor/ckeditor5-linters-config/compare/v17.1.0...v17.1.1) (July 16, 2026)

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: Bumped the `@eslint/css` dependency to `^1.4.0` to pick up updated Baseline data. The `:dir()` selector and the `mask` property are now recognized as Baseline "widely available", so projects relying on `css/use-baseline` no longer need a local exception for them.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/17.1.1): v17.1.0 => v17.1.1
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/17.1.1): v17.1.0 => v17.1.1
</details>


## [17.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v17.0.0...v17.1.0) (July 14, 2026)

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `ckeditor5-rules/allow-css-imports-only-in-main-package-entry-point` rule. It allows importing CSS files only in the main package entry point (`src/index.ts`), where the single `theme/index.css` entry stylesheet is loaded, and reports CSS imports in any other source module. See [ckeditor/ckeditor5#17102](https://github.com/ckeditor/ckeditor5/issues/17102).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/17.1.0): v17.0.0 => v17.1.0

Other releases:

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/17.1.0): v17.0.0 => v17.1.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
