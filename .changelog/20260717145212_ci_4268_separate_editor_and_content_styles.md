---
type: Major breaking change

scope:
  - eslint-config-ckeditor5
---

The CSS preset now enables the `ckeditor5-rules/content-styles-in-index-content` and `ckeditor5-rules/no-editor-styles-in-index-content` rules as errors for `**/theme/**/*.css` files. Packages that keep content styles (selectors rooted at `.ck-content`) outside `theme/index-content.css`, or editor styles inside it, must move those styles to the matching entry point.
