---
type: Feature
scope:
  - eslint-plugin-ckeditor5-rules
---

Added the `require-trusted-types-for-sinks` rule. It reports HTML strings and attribute values that reach a DOM injection sink, such as `innerHTML` or `setAttribute( 'onclick', value )`, without going through the `trustedHtml()` or `_trustedAttributeValue()` helper from `@ckeditor/ckeditor5-utils`. Applications that enforce Trusted Types reject such plain strings. The rule requires type information and is not enabled in `eslint-config-ckeditor5`.
