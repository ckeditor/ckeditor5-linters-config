---
type: Minor breaking change
scope:
  - eslint-plugin-ckeditor5-rules
  - eslint-config-ckeditor5
---

The `ckeditor5-rules/use-require-for-debug-mode-imports` ESLint rule has been removed. Debug mode imports (for example, `// @if CK_DEBUG // ...`) can now use the standard `import` syntax, because both the webpack-based and the Vite-based manual test servers handle the uncommented `import` statements correctly. The rule is no longer registered by `eslint-plugin-ckeditor5-rules` and is no longer enabled by `eslint-config-ckeditor5`.
