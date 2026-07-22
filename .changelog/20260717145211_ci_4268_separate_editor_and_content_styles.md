---
type: Feature

scope:
  - eslint-plugin-ckeditor5-rules
---

Added two CSS rules supporting the split of package themes into editor and content stylesheets: `ckeditor5-rules/content-styles-in-index-content` requires content styles (selectors rooted at `.ck-content`) to live in `theme/index-content.css`, and `ckeditor5-rules/no-editor-styles-in-index-content` disallows editor styles in that file.
