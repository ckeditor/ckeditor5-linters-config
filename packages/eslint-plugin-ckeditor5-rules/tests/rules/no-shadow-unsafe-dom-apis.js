/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );

const ruleTester = new RuleTester( {
	languageOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

ruleTester.run( 'eslint-plugin-ckeditor5-rules/no-shadow-unsafe-dom-apis', require( '../../lib/rules/no-shadow-unsafe-dom-apis' ), {
	valid: [
		{
			name: 'Reading a property named activeElement on a custom object',
			code: 'const el = someCustomObject.activeElement;\n'
		},

		{
			name: 'Reading .shadowRoot is not restricted here (used by a different rule)',
			code: 'const root = el.getRootNode();\n'
		},

		{
			name: 'Traversing a custom parentNode-like helper, not a raw DOM one',
			code: 'const parent = getParentOrHostElement( el );\n'
		},

		{
			name: 'Calling a locally imported helper also named getSelection',
			code: 'import { getSelection } from \'./shadow-dom-utils.js\';\nconst sel = getSelection();\n'
		},

		{
			name: 'Calling a locally declared function also named getSelection',
			code: 'function getSelection() { return null; }\nconst sel = getSelection();\n'
		},

		{
			name: 'Calling isConnected instead of contains',
			code: 'const connected = isConnected( el );\n'
		},

		{
			name: 'Calling elementFromPoint on a custom root, not on document',
			code: 'const found = someRoot.elementFromPoint( x, y );\n'
		},

		{
			name: 'caretRangeFromPoint called with a { shadowRoots } option',
			code: 'caretRangeFromPoint( x, y, { shadowRoots } );\n'
		},

		{
			name: 'querySelector called on a custom root, not on the top-level document',
			code: 'editingView.document.getRoot().querySelector( \'.foo\' );\n'
		},

		{
			name: 'composedPath is not restricted here (used by a different rule)',
			code: 'const root = getRootNode( el );\n'
		},

		{
			name: 'addEventListener with an event other than mouseenter, mouseleave or scroll',
			code: 'document.addEventListener( \'click\', listener );\n'
		},

		{
			name: 'appendChild called on a custom body-collection root',
			code: 'bodyCollectionRoot.appendChild( el );\n'
		}
	],
	invalid: [
		{
			name: 'Reading document.activeElement',
			code: 'const el = document.activeElement;\n',
			errors: [
				{ messageId: 'activeElement' }
			]
		},

		{
			name: 'Reading global.document.activeElement',
			code: 'const el = global.document.activeElement;\n',
			errors: [
				{ messageId: 'activeElement' }
			]
		},

		{
			name: 'Reading *.ownerDocument.activeElement',
			code: 'const el = someEl.ownerDocument.activeElement;\n',
			errors: [
				{ messageId: 'activeElement' }
			]
		},

		{
			name: 'Reading .shadowRoot for root discovery',
			code: 'const root = el.shadowRoot;\n',
			errors: [
				{ messageId: 'shadowRootDiscovery' }
			]
		},

		{
			name: 'Traversing .parentNode directly',
			code: 'const parent = el.parentNode;\n',
			errors: [
				{ messageId: 'parentTraversal' }
			]
		},

		{
			name: 'Traversing .parentElement directly',
			code: 'const parent = el.parentElement;\n',
			errors: [
				{ messageId: 'parentTraversal' }
			]
		},

		{
			name: 'Calling the bare, unresolved global getSelection()',
			code: 'const sel = getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling window.getSelection()',
			code: 'const sel = window.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling *.ownerDocument.defaultView.getSelection()',
			code: 'const sel = someEl.ownerDocument.defaultView.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling document.body.contains(...)',
			code: 'document.body.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling *.ownerDocument.contains(...)',
			code: 'someEl.ownerDocument.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling document.elementFromPoint(...)',
			code: 'document.elementFromPoint( x, y );\n',
			errors: [
				{ messageId: 'elementFromPoint' }
			]
		},

		{
			name: 'Calling document.elementsFromPoint(...)',
			code: 'document.elementsFromPoint( x, y );\n',
			errors: [
				{ messageId: 'elementFromPoint' }
			]
		},

		{
			name: 'Calling global.document.elementFromPoint(...)',
			code: 'global.document.elementFromPoint( x, y );\n',
			errors: [
				{ messageId: 'elementFromPoint' }
			]
		},

		{
			name: 'Calling *.ownerDocument.elementFromPoint(...)',
			code: 'someEl.ownerDocument.elementFromPoint( x, y );\n',
			errors: [
				{ messageId: 'elementFromPoint' }
			]
		},

		{
			name: 'Calling document.caretRangeFromPoint(...) without { shadowRoots }',
			code: 'document.caretRangeFromPoint( x, y );\n',
			errors: [
				{ messageId: 'caretFromPoint' }
			]
		},

		{
			name: 'Calling caretPositionFromPoint(...) without { shadowRoots }',
			code: 'caretPositionFromPoint( x, y );\n',
			errors: [
				{ messageId: 'caretFromPoint' }
			]
		},

		{
			name: 'Calling document.querySelector(...) against the top-level document',
			code: 'document.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentQuerySelector' }
			]
		},

		{
			name: 'Calling document.getElementById(...) against the top-level document',
			code: 'document.getElementById( \'foo\' );\n',
			errors: [
				{ messageId: 'documentQuerySelector' }
			]
		},

		{
			name: 'Calling global.document.querySelector(...)',
			code: 'global.document.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentQuerySelector' }
			]
		},

		{
			name: 'Calling *.ownerDocument.querySelector(...)',
			code: 'someEl.ownerDocument.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentQuerySelector' }
			]
		},

		{
			name: 'Using composedPath() for root discovery',
			code: 'const root = event.composedPath()[ 0 ];\n',
			errors: [
				{ messageId: 'composedPath' }
			]
		},

		{
			name: 'Attaching a global mouseenter listener on document',
			code: 'document.addEventListener( \'mouseenter\', listener );\n',
			errors: [
				{ messageId: 'globalDocumentListener' }
			]
		},

		{
			name: 'Attaching a global scroll listener on global.document',
			code: 'global.document.addEventListener( \'scroll\', listener );\n',
			errors: [
				{ messageId: 'globalDocumentListener' }
			]
		},

		{
			name: 'Appending directly to document.body',
			code: 'document.body.appendChild( el );\n',
			errors: [
				{ messageId: 'bodyAppendChild' }
			]
		},

		{
			name: 'Appending directly to global.document.body',
			code: 'global.document.body.appendChild( el );\n',
			errors: [
				{ messageId: 'bodyAppendChild' }
			]
		},

		{
			name: 'Appending directly to *.ownerDocument.body',
			code: 'someEl.ownerDocument.body.appendChild( el );\n',
			errors: [
				{ messageId: 'bodyAppendChild' }
			]
		}
	]
} );
