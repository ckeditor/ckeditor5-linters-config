/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/no-disallowed-color-formats';
const rule = require( '../../lib/rules/no-disallowed-color-formats' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const hexError = { messageId: 'disallowedHex' };
const rgbError = { messageId: 'disallowedRgb' };
const namedColorError = { messageId: 'disallowedNamedColor' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			// An empty file.
			code: ''
		},
		{
			// HSL is allowed.
			code: '.foo { color: hsl(0, 0%, 0%); }'
		},
		{
			// HSLA is allowed.
			code: '.foo { color: hsla(0, 0%, 0%, 0.5); }'
		},
		{
			// CSS custom property reference is allowed.
			code: '.foo { color: var(--ck-color-text); }'
		},
		{
			// Custom property whose name includes a color-like token is allowed.
			code: '.foo { color: var(--ck-color-red-shade); }'
		},
		{
			// Custom property whose name contains "rgb" - no longer a false positive
			// (was incorrectly flagged by the prior substring-based check).
			code: '.foo { color: var(--ck-color-srgb); }'
		},
		{
			// `transparent` is intentionally allowed.
			code: '.foo { background: transparent; }'
		},
		{
			// `currentcolor` is intentionally allowed.
			code: '.foo { color: currentcolor; }'
		},
		{
			// Numeric values without color tokens.
			code: '.foo { opacity: 0.5; margin: 10px; }'
		},
		{
			// Linear gradient using HSL stops.
			code: '.foo { background: linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 100%)); }'
		},
		{
			// `color-mix(in srgb, ...)` - the `srgb` color space identifier must not
			// be mistaken for `rgb()`.
			code: '.foo { background: color-mix(in srgb, hsl(0, 0%, 0%), hsl(0, 0%, 100%)); }'
		},
		{
			// `url(#fragment)` references an SVG fragment, not a hex color.
			code: '.foo { background: url(#gradient); }'
		},
		{
			// Named colors appearing inside a string value must not be flagged.
			code: '.foo { grid-template-areas: "red red"; }'
		},
		{
			// `font-family` values are identifiers but never colors.
			code: '.foo { font-family: Red Hat Text; }'
		},
		{
			// `content` strings can hold any text including named-color words.
			code: '.foo { content: "blue"; }'
		},
		{
			// `animation-name` is an identifier, not a color.
			code: '.foo { animation-name: red; }'
		},
		{
			// `tan()` is a math function; the identifier `tan` is not present.
			code: '.foo { width: calc(100px * tan(45deg)); }'
		},
		{
			// Custom property with a non-color value must not false-positive.
			code: ':root { --ck-spacing: 10px; }'
		},
		{
			// HSL inside a custom property is allowed.
			code: ':root { --ck-color-bg: hsl(0, 0%, 100%); }'
		},
		{
			// `var(--...)` reference inside a custom property is allowed.
			code: ':root { --ck-color-aliased: var(--ck-color-base); }'
		}
	],

	invalid: [
		{
			// Hex short form.
			code: '.foo { color: #fff; }',
			errors: [ hexError ]
		},
		{
			// Hex long form.
			code: '.foo { color: #abcdef; }',
			errors: [ hexError ]
		},
		{
			// Hex with alpha channel.
			code: '.foo { color: #abcdef80; }',
			errors: [ hexError ]
		},
		{
			// Two hex colors inside a gradient - reported per occurrence.
			code: '.foo { background: linear-gradient(#000, #fff); }',
			errors: [ hexError, hexError ]
		},
		{
			// rgb() call.
			code: '.foo { color: rgb(0, 0, 0); }',
			errors: [ rgbError ]
		},
		{
			// rgba() call.
			code: '.foo { color: rgba(0, 0, 0, 0.5); }',
			errors: [ rgbError ]
		},
		{
			// Uppercase RGB() - the prior substring `.includes('rgb')` missed this.
			code: '.foo { color: RGB(0, 0, 0); }',
			errors: [ rgbError ]
		},
		{
			// Two rgb() calls inside a gradient - reported per occurrence.
			code: '.foo { background: linear-gradient(rgb(0, 0, 0), rgb(255, 255, 255)); }',
			errors: [ rgbError, rgbError ]
		},
		{
			// Named color `red`.
			code: '.foo { color: red; }',
			errors: [ namedColorError ]
		},
		{
			// Named color `blue`, uppercase.
			code: '.foo { color: BLUE; }',
			errors: [ namedColorError ]
		},
		{
			// Named colors inside a gradient - reported per occurrence.
			code: '.foo { background: linear-gradient(red, blue); }',
			errors: [ namedColorError, namedColorError ]
		},
		{
			// Compound named color.
			code: '.foo { color: darkslateblue; }',
			errors: [ namedColorError ]
		},
		{
			// Named color `tan` as an identifier value.
			code: '.foo { color: tan; }',
			errors: [ namedColorError ]
		},
		{
			// Mixed hex and rgb() - each reported once on its own node.
			code: '.foo { background: linear-gradient(#fff, rgb(0, 0, 0)); }',
			errors: [ hexError, rgbError ]
		},
		{
			// Hex inside a custom-property value (Raw token).
			code: ':root { --ck-color-bg: #fff; }',
			errors: [ hexError ]
		},
		{
			// rgb() inside a custom-property value.
			code: ':root { --ck-color-bg: rgb(0, 0, 0); }',
			errors: [ rgbError ]
		},
		{
			// Named color inside a custom-property value.
			code: ':root { --ck-color-bg: red; }',
			errors: [ namedColorError ]
		},
		{
			// Custom-property value with several violations - each reported per occurrence.
			code: ':root { --ck-gradient: linear-gradient(#fff, rgb(0, 0, 0), red); }',
			errors: [ hexError, rgbError, namedColorError ]
		}
	]
} );
