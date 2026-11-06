/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import path from 'node:path';
import { beforeAll, describe, it, expect } from 'vitest';
import { Linter, RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import rule from '../../lib/rules/no-shadow-unsafe-dom-apis.js';

// The file does not need to exist: the default project of the type checker takes the code as it is.
const filename = path.join( import.meta.dirname, 'file.ts' );

const languageOptions = {
	parser: tsParser,
	parserOptions: {
		projectService: { allowDefaultProject: [ '*.ts' ] },
		tsconfigRootDir: import.meta.dirname
	}
};

const ruleTester = new RuleTester( { languageOptions } );

// Starting the type checker (including loading the DOM types) can take several seconds on CI. Start it up front, so
// that this cost is not charged against the timeout of whichever case runs first.
beforeAll( () => {
	new Linter().verify( '', { files: [ '**/*.ts' ], languageOptions }, filename );
}, 60_000 );

ruleTester.run( 'eslint-plugin-ckeditor5-rules/no-shadow-unsafe-dom-apis', rule, {
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
			name: 'Traversing with the shadow-aware getParentNode() helper, not a raw DOM property',
			code: 'const parent = getParentNode( el );\n'
		},

		{
			name: 'Traversing with the shadow-aware getParentElement() helper, not a raw DOM property',
			code: 'const parent = getParentElement( el );\n'
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
			name: 'Calling the shadow-aware containsNode() helper instead of contains',
			code: 'const has = containsNode( parent, el );\n'
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
			name: 'caretPositionFromPoint called with a { shadowRoots } option',
			code: 'caretPositionFromPoint( x, y, { shadowRoots } );\n'
		},

		{
			name: 'caretPositionFromPoint called with a { shadowRoots } option wrapped in an "as" cast',
			code: 'caretPositionFromPoint( x, y, ( { shadowRoots } as CaretFromPointOptions ) );\n'
		},

		{
			name: 'caretPositionFromPoint called with a { shadowRoots } option wrapped in a non-null assertion',
			code: 'caretPositionFromPoint( x, y, { shadowRoots }! );\n'
		},

		{
			name: 'document.caretPositionFromPoint called with a { shadowRoots } option',
			code: 'document.caretPositionFromPoint( x, y, { shadowRoots } );\n'
		},

		{
			name: 'caretPositionFromPoint called on a non-document object with a { shadowRoots } option',
			code: 'someRoot.caretPositionFromPoint( x, y, { shadowRoots } );\n'
		},

		{
			name: 'document.caretRangeFromPoint called with coordinates only — the legacy API has no shadow-aware form',
			code: 'const range = document.caretRangeFromPoint( x, y );\n'
		},

		{
			name: 'caretRangeFromPoint called on a document that is not spelled as a global one',
			code: 'const range = domDoc.caretRangeFromPoint( x, y );\n'
		},

		{
			name: 'Feature-detecting caretRangeFromPoint before falling back to it',
			code: 'if ( domDoc.caretRangeFromPoint && domDoc.caretRangeFromPoint( x, y ) ) {\n' +
				'\tdomRange = domDoc.caretRangeFromPoint( x, y );\n' +
				'}\n'
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
			name: 'Reading a private #relatedTarget field, not the DOM relatedTarget property',
			code: 'class Foo { #relatedTarget; bar() { return this.#relatedTarget; } }\n'
		},

		{
			name: 'Reading activeElement off a private #ownerDocument field, not the real ownerDocument',
			code: 'class Foo { #ownerDocument; bar() { return this.#ownerDocument.activeElement; } }\n'
		},

		{
			name: 'Calling a locally imported caretPositionFromPoint helper without a { shadowRoots } option',
			code: 'import { caretPositionFromPoint } from \'./shadow-dom-utils.js\';\ncaretPositionFromPoint( x, y );\n'
		},

		{
			name: 'Destructuring activeElement from a custom object',
			code: 'const { activeElement } = someCustomObject;\n'
		},

		{
			name: 'Destructuring in a function type, which is not run',
			code: 'type F = ( { relatedTarget }: FocusEvent ) => void;\n'
		},

		{
			name: 'Destructuring in a function declaration without a body, which is not run',
			code: 'declare function f( { parentNode }: Node ): void;\n'
		},

		{
			name: 'Destructuring in an interface method signature, which is not run',
			code: 'interface I { m( { shadowRoot }: Element ): void; }\n'
		},

		{
			name: 'Destructuring in an overload signature, which is not run',
			code: 'function f( { parentElement }: Node ): void;\nfunction f( node: Node ) {}\n'
		},

		{
			name: 'Reading activeElement off a class of the same name as the DOM Document (e.g. the model one)',
			code: 'export class Document { activeElement = null; }\n' +
				'declare const doc: Document;\n' +
				'doc.activeElement;\n'
		},

		{
			name: 'Reading activeElement off a value typed as any',
			code: 'declare const doc: any;\ndoc.activeElement;\n'
		},

		{
			name: 'Reading activeElement off a union of Document and ShadowRoot',
			code: 'function f( root: Document | ShadowRoot ) { return root.activeElement; }\n'
		},

		{
			name: 'Calling contains on an element',
			code: 'declare const el: HTMLElement;\ndeclare const other: Node;\nel.contains( other );\n'
		},

		{
			name: 'Destructuring in an abstract method',
			code: 'abstract class A { abstract m( { activeElement }: Document ): void; }\n'
		},

		{
			name: 'Destructuring nested in the parameter of a function declaration without a body',
			code: 'declare function f( { node: { parentNode } }: { node: Node } ): void;\n'
		},

		{
			name: 'Calling bare functions that share their names with the checked methods, so there is no receiver',
			code: 'declare const el: Node;\n' +
				'addEventListener( \'scroll\', () => {} );\n' +
				'removeEventListener( \'scroll\', () => {} );\n' +
				'querySelector( \'.foo\' );\n' +
				'elementFromPoint( 0, 0 );\n' +
				'appendChild( el );\n'
		},

		{
			name: 'Creating a TreeWalker and a NodeIterator without the root argument',
			code: 'document.createTreeWalker();\ndocument.createNodeIterator();\n'
		}
	].map( withFilename ),

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
			code: 'declare const someEl: Element;\n' +
				'const el = someEl.ownerDocument.activeElement;\n',
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
			name: 'Traversing .parentNode directly points at getParentNode()',
			code: 'const parent = el.parentNode;\n',
			errors: [
				{ messageId: 'parentTraversal', data: { property: 'parentNode', replacement: 'getParentNode' } }
			]
		},

		{
			name: 'Traversing .parentElement directly points at getParentElement()',
			code: 'const parent = el.parentElement;\n',
			errors: [
				{ messageId: 'parentTraversal', data: { property: 'parentElement', replacement: 'getParentElement' } }
			]
		},

		{
			name: 'Traversing .parentNode accessed through bracket notation',
			code: 'const parent = el[ \'parentNode\' ];\n',
			errors: [
				{ messageId: 'parentTraversal', data: { property: 'parentNode', replacement: 'getParentNode' } }
			]
		},

		{
			name: 'Reading .relatedTarget off an event',
			code: 'const target = evt.relatedTarget;\n',
			errors: [
				{ messageId: 'relatedTarget' }
			]
		},

		{
			name: 'Reading .relatedTarget off a native DOM event',
			code: 'const target = evt.domEvent.relatedTarget;\n',
			errors: [
				{ messageId: 'relatedTarget' }
			]
		},

		{
			name: 'Reading .relatedTarget through optional chaining',
			code: 'const target = evt?.relatedTarget;\n',
			errors: [
				{ messageId: 'relatedTarget' }
			]
		},

		{
			name: 'Reading .relatedTarget accessed through bracket notation',
			code: 'const target = evt[ \'relatedTarget\' ];\n',
			errors: [
				{ messageId: 'relatedTarget' }
			]
		},

		{
			name: 'Reading .relatedTarget off a non-event object — reported anyway, the rule can be disabled',
			code: 'const target = someCustomObject.relatedTarget;\n',
			errors: [
				{ messageId: 'relatedTarget' }
			]
		},

		{
			name: 'Assigning to .relatedTarget',
			code: 'evt.relatedTarget = el;\n',
			errors: [
				{ messageId: 'relatedTarget' }
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
			name: 'Calling getSelection() declared global via a /* global */ directive comment',
			code: '/* global getSelection */\nconst sel = getSelection();\n',
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
			code: 'declare const someEl: Element;\n' +
				'const sel = someEl.ownerDocument.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling *.ownerDocument.defaultView.getSelection()',
			code: 'declare const someEl: Element;\n' +
				'const sel = someEl.ownerDocument.defaultView.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Calling document.contains(...) points at isConnected and containsNode()',
			code: 'document.contains( el );\n',
			errors: [
				{ messageId: 'contains', data: { path: 'document.contains' } }
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
			code: 'declare const someEl: Element;\n' +
				'someEl.ownerDocument.contains( el );\n',
			errors: [
				{ messageId: 'contains' }
			]
		},

		{
			name: 'Calling *.ownerDocument.body.contains(...)',
			code: 'declare const someEl: Element;\n' +
				'someEl.ownerDocument.body.contains( el );\n',
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
			code: 'declare const someEl: Element;\n' +
				'someEl.ownerDocument.elementFromPoint( x, y );\n',
			errors: [
				{ messageId: 'elementFromPoint' }
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
			name: 'Calling caretPositionFromPoint(...) on a non-document object without { shadowRoots }',
			code: 'someRoot.caretPositionFromPoint( x, y );\n',
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
			code: 'declare const someEl: Element;\n' +
				'someEl.ownerDocument.querySelector( \'.foo\' );\n',
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
			code: 'declare const someEl: Element;\n' +
				'someEl.ownerDocument.getElementsByTagName( \'p\' );\n',
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
			code: 'declare const someEl: Element;\n' +
				'document.createTreeWalker( someEl.ownerDocument, NodeFilter.SHOW_ELEMENT );\n',
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
			name: 'Attaching a pointerenter listener on document',
			code: 'document.addEventListener( \'pointerenter\', listener );\n',
			errors: [
				{ messageId: 'documentListener' }
			]
		},

		{
			name: 'Attaching a pointerleave listener on global.document',
			code: 'global.document.addEventListener( \'pointerleave\', listener );\n',
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
			code: 'declare const someEl: Element;\n' +
				'someEl.ownerDocument.addEventListener( \'mouseleave\', listener );\n',
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
			code: 'declare const someEl: Element;\n' +
				'someEl.ownerDocument.body.appendChild( el );\n',
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
			code: 'declare const someEl: Element;\n' +
				'( someEl.ownerDocument as Document ).contains( el );\n',
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
		},

		{
			name: 'Calling querySelector on document.body accessed through bracket notation',
			code: 'document[ \'body\' ].querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling querySelector on document through a bracket-notation method name',
			code: 'document[ \'querySelector\' ]( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling appendChild on document.body accessed through a template literal key',
			code: 'document[ `body` ].appendChild( el );\n',
			errors: [
				{ messageId: 'bodyAppendChild' }
			]
		},

		{
			name: 'Calling querySelector on globalThis.document',
			code: 'globalThis.document.querySelector( \'.foo\' );\n',
			errors: [
				{ messageId: 'documentElementLookup' }
			]
		},

		{
			name: 'Calling getSelection on self',
			code: 'const sel = self.getSelection();\n',
			errors: [
				{ messageId: 'getSelection' }
			]
		},

		{
			name: 'Destructuring activeElement from document',
			code: 'const { activeElement } = document;\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'document' } }
			]
		},

		{
			name: 'Destructuring activeElement under an alias from window.document',
			code: 'const { activeElement: active } = window.document;\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'window.document' } }
			]
		},

		{
			name: 'Destructuring activeElement in an assignment from *.ownerDocument',
			code: 'declare const el: Element;\nlet activeElement;\n( { activeElement } = el.ownerDocument );\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'el.ownerDocument' } }
			]
		},

		{
			name: 'Destructuring activeElement in a parameter defaulting to document',
			code: 'function f( { activeElement } = document ) {}\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'document' } }
			]
		},

		{
			name: 'Destructuring several restricted properties, each reported at its own property',
			code: 'const { shadowRoot, parentNode } = el;\n',
			errors: [
				{ messageId: 'shadowRootDiscovery', line: 1, column: 9 },
				{ messageId: 'parentTraversal', line: 1, column: 21 }
			]
		},

		{
			name: 'Destructuring parentElement under an alias',
			code: 'const { parentElement: parent } = el;\n',
			errors: [
				{ messageId: 'parentTraversal', data: { property: 'parentElement', replacement: 'getParentElement' } }
			]
		},

		{
			name: 'Destructuring relatedTarget in an event listener parameter',
			code: 'el.addEventListener( \'focusout\', ( { relatedTarget } ) => {} );\n',
			errors: [
				{ messageId: 'relatedTarget' }
			]
		},

		{
			name: 'Destructuring relatedTarget nested in a parameter of a function with a body',
			code: 'function f( { evt: { relatedTarget } } ) {}\n',
			errors: [
				{ messageId: 'relatedTarget' }
			]
		},

		{
			name: 'Destructuring activeElement from a variable typed as Document',
			code: 'var doc: Document = document;\nconst { activeElement } = doc;\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'doc' } }
			]
		},

		{
			name: 'Reading activeElement off the document of a local `global` object (as imported from ckeditor5-utils)',
			code: 'declare const global: { readonly document: Document; readonly window: Window & typeof globalThis };\n' +
				'global.document.activeElement;\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'global.document' } }
			]
		},

		{
			name: 'Reading activeElement off a generic constrained to Document',
			code: 'function f<T extends Document>( doc: T ) { return doc.activeElement; }\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'doc' } }
			]
		},

		{
			name: 'Reading activeElement off a nullable Document',
			code: 'function f( doc: Document | null ) { return doc!.activeElement; }\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'doc' } }
			]
		},

		{
			name: 'Reading activeElement off an HTMLDocument, which extends Document',
			code: 'declare const doc: HTMLDocument;\ndoc.activeElement;\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'doc' } }
			]
		},

		{
			name: 'Reading activeElement through a cast to Document',
			code: 'declare const node: Node;\n( node as Document ).activeElement;\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'node' } }
			]
		},

		{
			name: 'Calling getSelection on a Window',
			code: 'function f( win: Window ) { return win.getSelection(); }\n',
			errors: [
				{ messageId: 'getSelection', data: { path: 'win.getSelection' } }
			]
		},

		{
			name: 'Destructuring activeElement in a parameter typed as Document',
			code: 'function f( { activeElement }: Document ) {}\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'Document' } }
			]
		},

		{
			name: 'Destructuring activeElement from the document nested in window',
			code: 'const { document: { activeElement } } = window;\n',
			errors: [
				{ messageId: 'activeElement', data: { path: 'Document' } }
			]
		},

		{
			name: 'Destructuring parentNode in a function with a body',
			code: 'function f( { parentNode }: Node ) {}\n',
			errors: [
				{ messageId: 'parentTraversal', data: { property: 'parentNode', replacement: 'getParentNode' } }
			]
		}
	].map( withFilename )
} );

describe( 'no-shadow-unsafe-dom-apis without type information', () => {
	it( 'throws an error that explains how to enable type information', () => {
		const linter = new Linter();

		expect( () => linter.verify( 'document.activeElement;\n', {
			files: [ '**/*.ts' ],
			languageOptions: { parser: tsParser },
			plugins: { 'ckeditor5-rules': { rules: { 'no-shadow-unsafe-dom-apis': rule } } },
			rules: { 'ckeditor5-rules/no-shadow-unsafe-dom-apis': 'error' }
		}, 'file.ts' ) ).toThrow( /requires type information/ );
	} );
} );

function withFilename( testCase ) {
	return { filename, ...testCase };
}
