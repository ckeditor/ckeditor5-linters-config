/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const css = require( '@eslint/css' ).default;

const ruleName = 'ckeditor5-rules/no-descending-specificity';
const rule = require( '../../lib/rules/no-descending-specificity' );

const ruleTester = new RuleTester( {
	plugins: { css },
	language: 'css/css',
	languageOptions: {
		tolerant: true
	}
} );

const descendingError = { messageId: 'descendingSpecificity' };

ruleTester.run( ruleName, rule, {
	valid: [
		{
			name: 'An empty file',
			code: ''
		},
		{
			name: 'Ascending specificity is the intended order',
			code: 'a { top: 0; } b a { top: 1px; }'
		},
		{
			name: 'Different key selectors are never compared',
			code: '#x b { top: 0; } a { top: 1px; }'
		},
		{
			name: 'Equal specificity in either order',
			code: 'b a { top: 0; } i a { top: 1px; }'
		},
		{
			name: 'A pseudo-element creates its own key and is not compared with the plain element',
			code: 'b a::before { top: 0; } a { top: 1px; }'
		},
		{
			name: 'Different @media conditions are different contexts',
			code: '@media (width >= 600px) { b a { top: 0; } } a { top: 1px; }'
		},
		{
			name: 'Different nesting parents are different contexts',
			code: '.x { & b a { top: 0; } } .y { & a { top: 1px; } }'
		},
		{
			name: ':where() adds no specificity, so this is equal, not descending',
			code: 'a:where(.x) { top: 0; } a { top: 1px; }'
		},
		{
			name: 'Keyframe selectors are not compared',
			code: '@keyframes spin { from { top: 0; } 50% { top: 1px; } to { top: 2px; } }'
		},
		{
			name: ':where() nested inside :is() adds no specificity, so this is equal, not descending',
			code: 'a:is(.b:where(.c.d)) { top: 0; } .e a { top: 1px; }'
		},
		{
			name: '& inside :is() and an implicit parent prefix both carry the parent specificity, making this ascending',
			code: '#p { :is(&, .a) x { top: 0; } .b.c x { top: 1px; } }'
		},
		{
			name: ':nth-child() without an of-selector stays an ordinary pseudo-class',
			code: '.d a:nth-child(2n) { top: 0; } .e.f a { top: 1px; }'
		},
		{
			name: 'A nested selector without & implicitly inherits the parent specificity, equal to the & form',
			code: '.p.q { & b a { top: 0; } b a { top: 1px; } }'
		},
		{
			name: 'An empty earlier rule is not compared',
			code: 'b a {} a { top: 1px; }'
		},
		{
			name: 'An empty later rule is not compared',
			code: 'b a { top: 0; } a {}'
		},
		{
			name: 'A pure nesting container without own declarations is not compared',
			code: 'b a { top: 0; } a { & i { top: 1px; } }'
		},
		{
			name: 'Anonymous cascade layers are distinct contexts',
			code: '@layer { b a { top: 0; } } @layer { a { top: 1px; } }'
		}
	],

	invalid: [
		{
			name: 'Descendant selector first, bare element after',
			code: 'b a { top: 0; } a { top: 1px; }',
			errors: [ descendingError ]
		},
		{
			name: 'Id-based selector first, class-free descendant after',
			code: '#x a { top: 0; } b a { top: 1px; }',
			errors: [ descendingError ]
		},
		{
			name: 'A pseudo-class shares the key with the plain element and has higher specificity',
			code: 'a:hover { top: 0; } a { top: 1px; }',
			errors: [ descendingError ]
		},
		{
			name: 'Descending order within the same @media context',
			code: '@media (width >= 600px) { b a { top: 0; } a { top: 1px; } }',
			errors: [ descendingError ]
		},
		{
			name: 'Descending order between nested selectors under the same parent',
			code: '.x { & b a { top: 0; } & a { top: 1px; } }',
			errors: [ descendingError ]
		},
		{
			name: ':not() takes the specificity of its argument',
			code: 'a:not(.x) { top: 0; } a { top: 1px; }',
			errors: [ descendingError ]
		},
		{
			name: 'Arguments of :is() still count fully when they contain a nested :where()',
			code: 'a:is(.b.c:where(.d)) { top: 0; } .e a { top: 1px; }',
			errors: [ descendingError ]
		},
		{
			name: '& inside :is() carries only the parent specificity, descending after an implicitly prefixed nested selector',
			code: '#p { .b.c x { top: 1px; } :is(&, .a) x { top: 0; } }',
			errors: [ descendingError ]
		},
		{
			name: ':nth-child(... of S) counts its most specific argument on top of the pseudo-class',
			code: 'a:nth-child(2n of .b.c) { top: 0; } .d a { top: 1px; }',
			errors: [ descendingError ]
		},
		{
			name: 'A bare nested selector and an & form under one parent compare at their real weights',
			code: '.p.q { b a { top: 0; } & a { top: 1px; } }',
			errors: [ descendingError ]
		},
		{
			name: 'Declarations inside a nested at-rule count as the rule\'s own declarations',
			code: 'b a { @media (width > 0) { top: 0; } } a { @media (width > 0) { top: 1px; } }',
			errors: [ descendingError ]
		},
		{
			name: ':host() counts its argument specificity on top of the pseudo-class',
			code: ':host(.x) a { top: 0; } .y a { top: 1px; }',
			errors: [ descendingError ]
		},
		{
			name: 'The same named cascade layer is one context',
			code: '@layer x { b a { top: 0; } } @layer x { a { top: 1px; } }',
			errors: [ descendingError ]
		},
		{
			name: 'Selector-list members are checked individually',
			code: 'b a { top: 0; } i, a { top: 1px; }',
			errors: [ descendingError ]
		}
	]
} );
