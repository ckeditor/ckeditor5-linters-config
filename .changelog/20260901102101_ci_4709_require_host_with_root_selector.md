---
type: Minor breaking change
scope:
  - eslint-plugin-ckeditor5-rules
  - eslint-config-ckeditor5
---

Added the `require-host-with-root-selector` rule, which reports a `:root` selector that is not paired with `:host`. A `:root` selector matches nothing inside a shadow root, so declarations anchored on it alone do not apply to an editor mounted in one. The shared preset enables the rule for `**/theme/**/*.css`, so stylesheets that declare custom properties on a bare `:root` now fail linting. The rule is autofixable: it rewrites `:root` to `:root,\n:host`.
