Changelog
=========

## [21.0.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v20.1.0...v21.0.0) (September 10, 2026)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: The `typescript` peer dependency now requires v5.8.3 or later, up from v5.5.4. Projects using an older TypeScript version must upgrade before updating the preset.

### Other changes

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5)**: The preset now parses source code as ES2023 instead of ES2020.

  Code that uses syntax introduced after ES2020, such as logical assignment operators, class fields or static initialization blocks, no longer raises parsing errors.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/21.0.0): v20.1.0 => v21.0.0

Other releases:

* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/21.0.0): v20.1.0 => v21.0.0
</details>


## [20.1.0](https://github.com/ckeditor/ckeditor5-linters-config/compare/v20.0.0...v20.1.0) (September 3, 2026)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5), [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: Added the `require-host-with-root-selector` rule, which reports a `:root` selector that is not paired with `:host`. A `:root` selector matches nothing inside a shadow root, so declarations anchored on it alone do not apply to an editor mounted in one. The shared preset enables the rule for `**/theme/**/*.css`, so stylesheets that declare custom properties on a bare `:root` now fail linting. The rule is autofixable: it rewrites `:root` to `:root,\n:host`.

### Features

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `no-shadow-unsafe-dom-apis` rule now reports reading `relatedTarget`, points at the shadow-aware helper that replaces each reported API (`isConnected` or `containsNode()` for `contains()`, `getParentNode()` and `getParentElement()` for `.parentNode` and `.parentElement`), and no longer reports `caretRangeFromPoint()` calls at all.

  `relatedTarget` is retargeted at Shadow DOM boundaries, so it does not point at the actual node the pointer came from or went to. Since a name like this is rarely used for anything else and an ESLint disable comment can be used to silence the occasional false positive, it is added on every access without verifying which object it belongs to. Destructuring, for example, `const { relatedTarget } = evt`, is not covered.

  Legacy `caretRangeFromPoint()` accepts coordinates only and has no shadow-aware form, so it is used exactly where `caretPositionFromPoint()` is unavailable. There is nothing to switch to and no option to add, so flagging it only produced noise in the fallback branch. Only `caretPositionFromPoint()` is still reported when it is missing a `{ shadowRoots }` option.

### Bug fixes

* **[eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules)**: The `no-editor-styles-in-index-content` rule no longer reports a bare `:host` selector that declares only custom properties. Together with `:root`, it marks the root scope a stylesheet resolves its custom properties in, so `:root, :host { --ck-content-*: … }` is now accepted in `theme/index-content.css`. A parameterized `:host(…)` still counts as an editor selector.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Minor releases (contain minor breaking changes):

* [eslint-config-ckeditor5](https://www.npmjs.com/package/eslint-config-ckeditor5/v/20.1.0): v20.0.0 => v20.1.0
* [eslint-plugin-ckeditor5-rules](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules/v/20.1.0): v20.0.0 => v20.1.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-linters-config/releases).
