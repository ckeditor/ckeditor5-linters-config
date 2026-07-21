/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { RuleTester } = require( 'eslint' );
const tsParser = require( '@typescript-eslint/parser' );

const ruleTester = new RuleTester( {
	languageOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		parser: tsParser
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
			name: 'Calling a locally imported getSelection helper through an "as" cast',
			code: 'import { getSelection } from \'./shadow-dom-utils.js\';\n' +
				'const sel = ( getSelection as typeof getSelection )();\n'
		},

		{
			name: 'Calling a locally imported getSelection helper through a non-null assertion',
			code: 'import { getSelection } from \'./shadow-dom-utils.js\';\nconst sel = getSelection!();\n'
		},

		{
			name: 'Calling isConnected instead of contains',
			code: 'const connected = isConnected( el );\n'
		},

		{
			name: 'Calling .body.contains(...) on a non-document object',
			code: 'const has = myWidget.body.contains( el );\n'
		},

		{
			name: 'Calling elementFromPoint on a custom root, not on document',
			code: 'const found = someRoot.elementFromPoint( x, y );\n'
		},

		{
			name: 'Calling getElementsByTagName on a custom root, not on document',
			code: 'const found = someRoot.getElementsByTagName( \'p\' );\n'
		},

		{
			name: 'Creating a TreeWalker rooted at a shadow root, not at the top-level document',
			code: 'document.createTreeWalker( shadowRoot, NodeFilter.SHOW_ELEMENT );\n'
		},

		{
			name: 'Creating a TreeWalker rooted at an arbitrary element, not at the top-level document',
			code: 'document.createTreeWalker( someElement, NodeFilter.SHOW_ELEMENT );\n'
		},

		{
			name: 'caretRangeFromPoint called with a { shadowRoots } option',
			code: 'caretRangeFromPoint( x, y, { shadowRoots } );\n'
		},

		{
			name: 'caretRangeFromPoint called with a { shadowRoots } option wrapped in an "as" cast',
			code: 'caretRangeFromPoint( x, y, ( { shadowRoots } as CaretFromPointOptions ) );\n'
		},

		{
			name: 'caretRangeFromPoint called with a { shadowRoots } option wrapped in a non-null assertion',
			code: 'caretRangeFromPoint( x, y, { shadowRoots }! );\n'
		},

		{
			name: 'document.caretPositionFromPoint called with a { shadowRoots } option',
			code: 'document.caretPositionFromPoint( x, y, { shadowRoots } );\n'
		},

		{
			name: 'caretRangeFromPoint called on a non-document object with a { shadowRoots } option',
			code: 'someRoot.caretRangeFromPoint( x, y, { shadowRoots } );\n'
		},

		{
			name: 'querySelector called on a custom root, not on the top-level document',
			code: 'editingView.document.getRoot().querySelector( \'.foo\' );\n'
		},

		{
			name: 'Calling .body.querySelector(...) on a non-document object',
			code: 'const found = myWidget.body.querySelector( \'.foo\' );\n'
		},

		{
			name: 'composedPath is not restricted here (used by a different rule)',
			code: 'const root = getRootNode( el );\n'
		},

		{
			name: 'Checking ancestry via composedPath().includes(...) kept as an array',
			code: 'const path = event.composedPath();\npath.includes( contextElement );\n'
		},

		{
			name: 'Checking ancestry via composedPath().includes(...) chained directly',
			code: 'event.composedPath().includes( contextElement );\n'
		},

		{
			name: 'addEventListener with an event other than mouseenter, mouseleave or scroll',
			code: 'document.addEventListener( \'click\', listener );\n'
		},

		{
			name: 'appendChild called on a custom body-collection root',
			code: 'bodyCollectionRoot.appendChild( el );\n'
		},

		{
			name: 'Casting a custom object, not a document access path',
			code: 'const el = ( someCustomObject as Foo ).activeElement;\n'
		},

		{
			name: 'Reading a private #shadowRoot field, not the DOM shadowRoot property',
			code: 'class Foo { #shadowRoot; bar() { return this.#shadowRoot; } }\n'
		},

		{
			name: 'Reading a private #parentNode field, not the DOM parentNode property',
			code: 'class Foo { #parentNode; bar() { return this.#parentNode; } }\n'
		},

		{
			name: 'Reading activeElement off a private #ownerDocument field, not the real ownerDocument',
			code: 'class Foo { #ownerDocument; bar() { return this.#ownerDocument.activeElement; } }\n'
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
			name: 'Reading window.document.activeElement',
			code: 'const el = window.document.activeElement;\n',
			errors: [
				{ messageId: 'activeElement' }
			]
		},

		{
			name: 'Reading global.window.document.activeElement',
			code: 'const el = global.window.document.activeElement;\n',
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
			name: 'Calling global.getSelection()',
			code: 'const sel = global.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling document.getSelection()',
			code: 'const sel = document.getSelection();\n',
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
			name: 'Calling global.window.getSelection()',
			code: 'const sel = global.window.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling global.document.getSelection()',
			code: 'const sel = global.document.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling window.document.getSelection()',
			code: 'const sel = window.document.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling global.window.document.getSelection()',
			code: 'const sel = global.window.document.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling *.ownerDocument.getSelection()',
			code: 'const sel = someEl.ownerDocument.getSelection();\n',
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
			name: 'Calling document.contains(...)',
			code: 'document.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling global.document.contains(...)',
			code: 'global.document.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling window.document.contains(...)',
			code: 'window.document.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling global.window.document.contains(...)',
			code: 'global.window.document.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
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
			name: 'Calling global.document.body.contains(...)',
			code: 'global.document.body.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling window.document.body.contains(...)',
			code: 'window.document.body.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling global.window.document.body.contains(...)',
			code: 'global.window.document.body.contains( el );\n',
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
			name: 'Calling *.ownerDocument.body.contains(...)',
			code: 'someEl.ownerDocument.body.contains( el );\n',
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
			name: 'Calling window.document.elementFromPoint(...)',
			code: 'window.document.elementFromPoint( x, y );\n',
			errors: [
				{ messageId: 'elementFromPoint' }
			]
		},

		{
			name: 'Calling global.window.document.elementFromPoint(...)',
			code: 'global.window.document.elementFromPoint( x, y );\n',
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
				{ messageId: 'caretRangeFromPointUnsupported' }
			]
		},

		{
			name: 'Calling document.caretRangeFromPoint(...) with { shadowRoots }, which is a no-op natively',
			code: 'document.caretRangeFromPoint( x, y, { shadowRoots } );\n',
			errors: [
				{ messageId: 'caretRangeFromPointUnsupported' }
			]
		},

		{
			name: 'Calling global.document.caretRangeFromPoint(...)',
			code: 'global.document.caretRangeFromPoint( x, y, { shadowRoots } );\n',
			errors: [
				{ messageId: 'caretRangeFromPointUnsupported' }
			]
		},

		{
			name: 'Calling window.document.caretRangeFromPoint(...)',
			code: 'window.document.caretRangeFromPoint( x, y, { shadowRoots } );\n',
			errors: [
				{ messageId: 'caretRangeFromPointUnsupported' }
			]
		},

		{
			name: 'Calling global.window.document.caretRangeFromPoint(...)',
			code: 'global.window.document.caretRangeFromPoint( x, y, { shadowRoots } );\n',
			errors: [
				{ messageId: 'caretRangeFromPointUnsupported' }
			]
		},

		{
			name: 'Calling *.ownerDocument.caretRangeFromPoint(...)',
			code: 'someEl.ownerDocument.caretRangeFromPoint( x, y, { shadowRoots } );\n',
			errors: [
				{ messageId: 'caretRangeFromPointUnsupported' }
			]
		},

		{
			name: 'Calling caretRangeFromPoint(...) on a non-document object without { shadowRoots }',
			code: 'someRoot.caretRangeFromPoint( x, y );\n',
			errors: [
				{ messageId: 'caretFromPoint' }
			]
		},

		{
			name: 'Calling document.caretPositionFromPoint(...) without { shadowRoots }',
			code: 'document.caretPositionFromPoint( x, y );\n',
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
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling document.getElementById(...) against the top-level document',
			code: 'document.getElementById( \'foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling document.body.querySelectorAll(...)',
			code: 'document.body.querySelectorAll( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling global.document.querySelector(...)',
			code: 'global.document.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling window.document.querySelector(...)',
			code: 'window.document.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling global.window.document.querySelector(...)',
			code: 'global.window.document.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling *.ownerDocument.querySelector(...)',
			code: 'someEl.ownerDocument.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling document.getElementsByTagName(...)',
			code: 'document.getElementsByTagName( \'p\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling document.getElementsByClassName(...)',
			code: 'document.getElementsByClassName( \'foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling document.getElementsByName(...)',
			code: 'document.getElementsByName( \'foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling *.ownerDocument.getElementsByTagName(...)',
			code: 'someEl.ownerDocument.getElementsByTagName( \'p\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
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
			name: 'Destructuring the first node out of composedPath() via a declaration',
			code: 'const [ target ] = event.composedPath();\n',
			errors: [
				{ messageId: 'composedPath' }
			]
		},

		{
			name: 'Destructuring the first node out of composedPath() via an assignment',
			code: '[ target ] = event.composedPath();\n',
			errors: [
				{ messageId: 'composedPath' }
			]
		},

		{
			name: 'Creating a TreeWalker rooted at document.body',
			code: 'document.createTreeWalker( document.body, NodeFilter.SHOW_ELEMENT );\n',
			errors: [
				{ messageId: 'documentTreeWalker' }
			]
		},

		{
			name: 'Creating a TreeWalker rooted directly at document',
			code: 'document.createTreeWalker( document, NodeFilter.SHOW_ELEMENT );\n',
			errors: [
				{ messageId: 'documentTreeWalker' }
			]
		},

		{
			name: 'Creating a NodeIterator rooted at global.document.body',
			code: 'document.createNodeIterator( global.document.body, NodeFilter.SHOW_ELEMENT );\n',
			errors: [
				{ messageId: 'documentTreeWalker' }
			]
		},

		{
			name: 'Creating a TreeWalker rooted at *.ownerDocument',
			code: 'document.createTreeWalker( someEl.ownerDocument, NodeFilter.SHOW_ELEMENT );\n',
			errors: [
				{ messageId: 'documentTreeWalker' }
			]
		},

		{
			name: 'Attaching a mouseenter listener on document',
			code: 'document.addEventListener( \'mouseenter\', listener );\n',
			errors: [
				{ messageId: 'documentListener' }
			]
		},

		{
			name: 'Attaching a scroll listener on global.document',
			code: 'global.document.addEventListener( \'scroll\', listener );\n',
			errors: [
				{ messageId: 'documentListener' }
			]
		},

		{
			name: 'Attaching a scroll listener on window.document',
			code: 'window.document.addEventListener( \'scroll\', listener );\n',
			errors: [
				{ messageId: 'documentListener' }
			]
		},

		{
			name: 'Attaching a mouseenter listener on global.window.document',
			code: 'global.window.document.addEventListener( \'mouseenter\', listener );\n',
			errors: [
				{ messageId: 'documentListener' }
			]
		},

		{
			name: 'Attaching a mouseleave listener on *.ownerDocument',
			code: 'someEl.ownerDocument.addEventListener( \'mouseleave\', listener );\n',
			errors: [
				{ messageId: 'documentListener' }
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
			name: 'Appending directly to window.document.body',
			code: 'window.document.body.appendChild( el );\n',
			errors: [
				{ messageId: 'bodyAppendChild' }
			]
		},

		{
			name: 'Appending directly to global.window.document.body',
			code: 'global.window.document.body.appendChild( el );\n',
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
		},

		{
			name: 'Traversing .parentNode through optional chaining',
			code: 'const parent = el?.parentNode;\n',
			errors: [
				{ messageId: 'parentTraversal' }
			]
		},

		{
			name: 'Reading document.activeElement through optional chaining',
			code: 'const el = document?.activeElement;\n',
			errors: [
				{ messageId: 'activeElement' }
			]
		},

		{
			name: 'Calling document.querySelector(...) through optional chaining',
			code: 'document?.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Reading activeElement through a TSAsExpression cast on ownerDocument',
			code: 'const el = ( element.ownerDocument as Document ).activeElement;\n',
			errors: [
				{ messageId: 'activeElement' }
			]
		},

		{
			name: 'Reading activeElement through a TSNonNullExpression on document',
			code: 'const el = document!.activeElement;\n',
			errors: [
				{ messageId: 'activeElement' }
			]
		},

		{
			name: 'Calling querySelector through a TSNonNullExpression on document',
			code: 'document!.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling contains through a TSAsExpression cast on ownerDocument',
			code: '( someEl.ownerDocument as Document ).contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Attaching a scroll listener where the event name is wrapped in "as const"',
			code: 'document.addEventListener( \'scroll\' as const, listener );\n',
			errors: [
				{ messageId: 'documentListener' }
			]
		},

		{
			name: 'Calling contains through a parenthesized optional chain',
			code: '( document?.body ).contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling appendChild through a parenthesized optional chain',
			code: '( document?.body ).appendChild( el );\n',
			errors: [
				{ messageId: 'bodyAppendChild' }
			]
		}
	]
} );
