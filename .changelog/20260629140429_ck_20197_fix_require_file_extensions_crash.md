---
type: Fix
scope:
  - eslint-plugin-ckeditor5-rules
closes:
  - ckeditor/ckeditor5#20197
---

The `ckeditor5-rules/require-file-extensions-in-imports` rule no longer crashes when an import points to a subpath that is not registered in the target package's `exports` field. Such imports are now reported as a regular missing file extension error.
