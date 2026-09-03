---
type: Fix
scope:
  - eslint-plugin-ckeditor5-rules
---

The `no-editor-styles-in-index-content` rule no longer reports a bare `:host` selector that declares only custom properties. Together with `:root`, it marks the root scope a stylesheet resolves its custom properties in, so `:root, :host { --ck-content-*: … }` is now accepted in `theme/index-content.css`. A parameterized `:host(…)` still counts as an editor selector.
