/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { Linter, RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import rule from '../../lib/rules/require-trusted-types-for-sinks.js';

// The files do not need to exist: the default project of the type checker takes the code as it is.
const filename = path.join( import.meta.dirname, 'file.ts' );
const helpersModuleFilename = path.join( import.meta.dirname, 'ckeditor5-utils', 'file.ts' );

const ruleTester = new RuleTester( {
	languageOptions: {
		parser: tsParser,
		parserOptions: {
			projectService: { allowDefaultProject: [ '*.ts', 'ckeditor5-utils/*.ts' ] },
			tsconfigRootDir: import.meta.dirname
		}
	}
} );

const DECLARATIONS = 'declare const element: HTMLElement;\ndeclare const html: string;\n';
const ATTRIBUTE_DECLARATIONS = DECLARATIONS + 'declare const attributeName: string;\ndeclare const value: string;\n';

const IMPORT_HTML_HELPER = 'import { trustedHtml } from \'@ckeditor/ckeditor5-utils\';\n\n';
const IMPORT_ATTRIBUTE_HELPER = 'import { _trustedAttributeValue } from \'@ckeditor/ckeditor5-utils\';\n\n';

const ASSERTED_ELEMENT_CODE = 'declare const view: { element: HTMLElement | null };\ndeclare const node: Node;\n' +
	'declare const attributeName: string;\ndeclare const value: string;\n' +
	'view.element!.setAttribute( attributeName, value );\n( node as Element ).setAttribute( attributeName, value );\n';

const SINK_METHOD_DECLARATIONS = DECLARATIONS + 'declare const shadowRoot: ShadowRoot;\ndeclare const range: Range;\n';

const SINK_METHOD_CALLS = {
	setHTMLUnsafe: 'shadowRoot.setHTMLUnsafe( html );',
	createContextualFragment: 'range.createContextualFragment( html );',
	parseFromString: 'new DOMParser().parseFromString( html, \'text/html\' );',
	parseHTMLUnsafe: 'Document.parseHTMLUnsafe( html );',
	write: 'document.write( html );',
	writeln: 'element.ownerDocument.writeln( html );'
};

ruleTester.run( 'eslint-plugin-ckeditor5-rules/require-trusted-types-for-sinks', rule, {
	valid: [
		{
			name: 'Assigning HTML returned by the helper',
			code: DECLARATIONS + 'element.innerHTML = trustedHtml( html );\n'
		},

		{
			name: 'Assigning HTML returned by the helper through a type assertion',
			code: DECLARATIONS + 'element.outerHTML = trustedHtml( html ) as string;\n'
		},

		{
			name: 'Assigning HTML with the logical assignment operators, which assign the right-hand side as it is',
			code: DECLARATIONS +
				'element.innerHTML ||= trustedHtml( html );\n' +
				'element.innerHTML &&= trustedHtml( html );\n' +
				'element.innerHTML ??= trustedHtml( html );\n'
		},

		{
			name: 'Assigning a plain string to a property of a DOM element that is not a sink',
			code: DECLARATIONS + 'element.title = html;\n'
		},

		{
			name: 'Assigning to a variable',
			code: 'declare const html: string;\nlet markup: string;\nmarkup = html;\n'
		},

		{
			name: 'Assigning innerHTML of a plain object',
			code: 'declare const html: string;\nconst data = { innerHTML: \'\' };\ndata.innerHTML = html;\n'
		},

		{
			name: 'Assigning innerHTML of a local class that shares its name with a DOM interface',
			code: 'declare const html: string;\nclass Element { public innerHTML = \'\'; }\nnew Element().innerHTML = html;\nexport {};\n'
		},

		{
			name: 'Assigning through a computed key whose type cannot name a sink, including a member that is not a string',
			code: DECLARATIONS + 'declare const key: \'title\' | 0;\nelement[ key ] = html;\n'
		},

		{
			name: 'Assigning through a computed key that can be any string on a receiver of an unknown type',
			code: 'declare const editor: object;\ndeclare const key: string;\ndeclare const value: string;\n' +
				'( editor as any )[ key ] = value;\n'
		},

		{
			name: 'Assigning through a computed key that can be any string, which does not compile on a DOM element',
			code: 'declare const target: HTMLElement & Record<string, string>;\ndeclare const key: string;\n' +
				'declare const html: string;\ntarget[ key ] = html;\n'
		},

		{
			name: 'Using private members that share their names with sinks',
			code: 'class View extends HTMLElement {\n' +
				'\t#innerHTML = \'\';\n' +
				'\t#write( html: string ) {}\n' +
				'\trender( html: string ) {\n\t\tthis.#innerHTML = html;\n\t\tthis.#write( html );\n\t}\n' +
				'}\n'
		},

		{
			name: 'Passing HTML returned by the helper as the second argument of insertAdjacentHTML()',
			code: DECLARATIONS + 'element.insertAdjacentHTML( \'beforeend\', trustedHtml( html ) );\n'
		},

		{
			name: 'Calling write() of something that is not a document',
			code: 'declare const items: ClipboardItem[];\nnavigator.clipboard.write( items );\n'
		},

		{
			name: 'Calling sink methods with a spread argument, which the rule cannot see into',
			code: DECLARATIONS + 'declare const args: [ string, string ];\n' +
				'new DOMParser().parseFromString( ...args );\nelement.setAttribute( ...args );\n'
		},

		{
			name: 'Setting attributes with literal names that never take a Trusted Type, or do so only on some elements',
			code: ATTRIBUTE_DECLARATIONS +
				'element.setAttribute( \'class\', value );\n' +
				'element.setAttribute( \'src\', value );\n' +
				'element.setAttribute( \'href\', value );\n'
		},

		{
			name: 'Setting an attribute with a name typed as a union of safe literals',
			code: ATTRIBUTE_DECLARATIONS +
				'for ( const name of [ \'id\', \'class\' ] as const ) {\n\telement.setAttribute( name, value );\n}\n'
		},

		{
			name: 'Setting an attribute with a constant name',
			code: ATTRIBUTE_DECLARATIONS + 'const NAME = \'data-replaced\';\nelement.setAttribute( NAME, value );\n'
		},

		{
			name: 'Setting an attribute with a value returned by the attribute helper',
			code: ATTRIBUTE_DECLARATIONS +
				'element.setAttribute( attributeName, _trustedAttributeValue( element, attributeName, value ) );\n'
		},

		{
			name: 'Calling the attribute helper with the same element written without a non-null assertion',
			code: ATTRIBUTE_DECLARATIONS +
				'element!.setAttribute( attributeName, _trustedAttributeValue( element, attributeName, value ) );\n'
		},

		{
			name: 'Setting an attribute through an editor writer, which is not a DOM element',
			code: 'declare const writer: { setAttribute( key: string, value: unknown, item: object ): void };\n' +
				'declare const key: string;\ndeclare const value: string;\ndeclare const item: object;\n' +
				'writer.setAttribute( key, value, item );\n'
		},

		{
			name: 'Assigning to an object whose constructor returns its own type, which must not loop',
			code: 'interface Factory { new (): Factory; innerHTML: string }\ndeclare const factory: Factory;\n' +
				'declare const html: string;\nfactory.innerHTML = html;\n'
		},

		{
			name: 'Calling a sink method and a function that writes HTML without the argument that the rule checks',
			options: [ { htmlWritingFunctions: { morphdom: 1 } } ],
			code: 'declare function morphdom( from: Node, to?: Node ): void;\n' + DECLARATIONS +
				'document.write();\nmorphdom( element );\n'
		},

		{
			name: 'Passing DOM nodes to a function that writes HTML to a sink of its own',
			options: [ { htmlWritingFunctions: { morphdom: 1 } } ],
			code: 'declare function morphdom( from: Node, to: Node | string ): void;\n' +
				'declare const element: HTMLElement;\ndeclare const fragment: DocumentFragment;\n' +
				'morphdom( element, element );\nmorphdom( element, fragment );\n'
		},

		{
			name: 'Calling a method that shares its name with a function that writes HTML to a sink of its own',
			options: [ { htmlWritingFunctions: { morphdom: 1 } } ],
			code: 'declare const view: { morphdom( from: Node, to: string ): void };\n' + DECLARATIONS +
				'view.morphdom( element, html );\n'
		}
	].map( withFilename ),

	invalid: [
		{
			name: 'Assigning a plain string to innerHTML, with the import added to a file without imports',
			code: DECLARATIONS + 'element.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				data: { name: 'innerHTML' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					data: { helper: 'trustedHtml' },
					output: IMPORT_HTML_HELPER + DECLARATIONS + 'element.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning a plain string, with the helper added to an existing import',
			code: 'import { global } from \'@ckeditor/ckeditor5-utils\';\n\n' + DECLARATIONS + 'element.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: 'import { global, trustedHtml } from \'@ckeditor/ckeditor5-utils\';\n\n' + DECLARATIONS +
						'element.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning a plain string, with the helper added to a type-only import, which becomes a value import',
			code: 'import type { Emitter, Locale } from \'@ckeditor/ckeditor5-utils\';\n\n' + DECLARATIONS + 'element.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: 'import { type Emitter, type Locale, trustedHtml } from \'@ckeditor/ckeditor5-utils\';\n\n' + DECLARATIONS +
						'element.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning a plain string, with a new import added after the imports of other modules',
			code: 'import { foo } from \'foo\';\n\n' + DECLARATIONS + 'element.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: 'import { foo } from \'foo\';\nimport { trustedHtml } from \'@ckeditor/ckeditor5-utils\';\n\n' +
						DECLARATIONS + 'element.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning a plain string, with a new import added after a namespace import, which cannot take a name',
			code: 'import * as utils from \'@ckeditor/ckeditor5-utils\';\n\n' + DECLARATIONS + 'element.innerHTML = html;\n' +
				'export { utils };\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: 'import * as utils from \'@ckeditor/ckeditor5-utils\';\n' +
						'import { trustedHtml } from \'@ckeditor/ckeditor5-utils\';\n\n' + DECLARATIONS +
						'element.innerHTML = trustedHtml( html );\nexport { utils };\n'
				} ]
			} ]
		},

		{
			name: 'Assigning a variable that holds the result of the helper, with the helper already in scope',
			code: 'import { trustedHtml } from \'./trustedtypes.js\';\n\n' + DECLARATIONS +
				'const safe = trustedHtml( html );\nelement.innerHTML = safe;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: 'import { trustedHtml } from \'./trustedtypes.js\';\n\n' + DECLARATIONS +
						'const safe = trustedHtml( html );\nelement.innerHTML = trustedHtml( safe );\n'
				} ]
			} ]
		},

		{
			name: 'Appending to innerHTML, even with the helper',
			code: DECLARATIONS + 'element.innerHTML += trustedHtml( html );\n',
			errors: [ {
				messageId: 'compoundAssignment',
				data: { name: 'innerHTML' }
			} ]
		},

		{
			name: 'Assigning a plain string to outerHTML through bracket notation with a string and a template literal',
			code: DECLARATIONS + 'element[ \'outerHTML\' ] = html;\nelement[ `outerHTML` ] = html;\n',
			errors: [ 'element[ \'outerHTML\' ]', 'element[ `outerHTML` ]' ].map( left => ( {
				messageId: 'property',
				data: { name: 'outerHTML' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + DECLARATIONS +
						'element[ \'outerHTML\' ] = html;\nelement[ `outerHTML` ] = html;\n'
							.replace( `${ left } = html`, `${ left } = trustedHtml( html )` )
				} ]
			} ) )
		},

		{
			name: 'Assigning a plain string to srcdoc of an iframe',
			code: 'declare const iframe: HTMLIFrameElement;\ndeclare const html: string;\niframe.srcdoc = html;\n',
			errors: [ {
				messageId: 'property',
				data: { name: 'srcdoc' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + 'declare const iframe: HTMLIFrameElement;\ndeclare const html: string;\n' +
						'iframe.srcdoc = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning through a computed key whose type includes the name of a sink',
			code: DECLARATIONS + 'declare const key: keyof HTMLElement;\nelement[ key ] = html;\n',
			errors: [ {
				messageId: 'property',
				data: { name: 'innerHTML' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + DECLARATIONS + 'declare const key: keyof HTMLElement;\n' +
						'element[ key ] = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning to an element of an intersection type',
			code: 'declare const target: HTMLElement & { isView: true };\ndeclare const html: string;\ntarget.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + 'declare const target: HTMLElement & { isView: true };\ndeclare const html: string;\n' +
						'target.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning to an element behind a type assertion',
			code: 'declare const node: Node;\ndeclare const html: string;\n( node as HTMLElement ).innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + 'declare const node: Node;\ndeclare const html: string;\n' +
						'( node as HTMLElement ).innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning to an element of a generic type',
			code: 'declare const html: string;\nfunction render<T extends HTMLElement>( element: T ) {\n' +
				'\telement.innerHTML = html;\n}\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + 'declare const html: string;\nfunction render<T extends HTMLElement>( element: T ) {\n' +
						'\telement.innerHTML = trustedHtml( html );\n}\n'
				} ]
			} ]
		},

		{
			name: 'Assigning to an object of a union type that includes a DOM element',
			code: 'declare const target: HTMLElement | { innerHTML: string };\ndeclare const html: string;\n' +
				'target.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + 'declare const target: HTMLElement | { innerHTML: string };\n' +
						'declare const html: string;\ntarget.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning a comma expression, which the suggestion keeps in parentheses',
			code: DECLARATIONS + 'let count = 0;\nelement.innerHTML = ( count++, html );\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + DECLARATIONS + 'let count = 0;\n' +
						'element.innerHTML = ( trustedHtml( ( count++, html ) ) );\n'
				} ]
			} ]
		},

		{
			name: 'Assigning to a receiver of an unknown type',
			code: 'declare const node: any;\ndeclare const html: string;\nnode.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + 'declare const node: any;\ndeclare const html: string;\n' +
						'node.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		},

		{
			name: 'Passing a plain string to insertAdjacentHTML() through optional chaining',
			code: 'declare const element: HTMLElement | undefined;\ndeclare const html: string;\n' +
				'element?.insertAdjacentHTML( \'beforeend\', html );\n',
			errors: [ {
				messageId: 'method',
				data: { name: 'insertAdjacentHTML' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + 'declare const element: HTMLElement | undefined;\ndeclare const html: string;\n' +
						'element?.insertAdjacentHTML( \'beforeend\', trustedHtml( html ) );\n'
				} ]
			} ]
		},

		{
			name: 'Passing a plain string to a sink method called through bracket notation',
			code: DECLARATIONS + 'element[ \'insertAdjacentHTML\' ]( \'beforeend\', html );\n',
			errors: [ {
				messageId: 'method',
				data: { name: 'insertAdjacentHTML' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + DECLARATIONS + 'element[ \'insertAdjacentHTML\' ]( \'beforeend\', trustedHtml( html ) );\n'
				} ]
			} ]
		},

		{
			name: 'Passing a plain string as any argument of write(), which joins every argument it is given',
			code: DECLARATIONS + 'document.write( trustedHtml( html ), html );\n',
			errors: [ {
				messageId: 'method',
				data: { name: 'write' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + DECLARATIONS + 'document.write( trustedHtml( html ), trustedHtml( html ) );\n'
				} ]
			} ]
		},

		...Object.entries( SINK_METHOD_CALLS ).map( ( [ name, call ] ) => ( {
			name: `Passing a plain string to ${ name }()`,
			code: SINK_METHOD_DECLARATIONS + call + '\n',
			errors: [ {
				messageId: 'method',
				data: { name },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_HTML_HELPER + SINK_METHOD_DECLARATIONS + call.replace( '( html', '( trustedHtml( html )' ) + '\n'
				} ]
			} ]
		} ) ),

		{
			name: 'Setting an attribute with a name that can be any attribute',
			code: ATTRIBUTE_DECLARATIONS + 'element.setAttribute( attributeName, value );\n',
			errors: [ {
				messageId: 'dynamicAttribute',
				data: { name: 'setAttribute' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					data: { helper: '_trustedAttributeValue' },
					output: IMPORT_ATTRIBUTE_HELPER + ATTRIBUTE_DECLARATIONS +
						'element.setAttribute( attributeName, _trustedAttributeValue( element, attributeName, value ) );\n'
				} ]
			} ]
		},

		{
			name: 'Setting an event handler attribute, whatever the case of its name',
			code: ATTRIBUTE_DECLARATIONS + 'element.setAttribute( \'onclick\', value );\nelement.setAttribute( \'ONCLICK\', value );\n',
			errors: [ 'onclick', 'ONCLICK' ].map( attribute => ( {
				messageId: 'trustedAttribute',
				data: { name: 'setAttribute', attribute },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_ATTRIBUTE_HELPER + ATTRIBUTE_DECLARATIONS +
						'element.setAttribute( \'onclick\', value );\nelement.setAttribute( \'ONCLICK\', value );\n'.replace(
							`'${ attribute }', value`,
							`'${ attribute }', _trustedAttributeValue( element, '${ attribute }', value )`
						)
				} ]
			} ) )
		},

		{
			name: 'Setting srcdoc with a name typed as a union that includes it',
			code: 'declare const iframe: HTMLIFrameElement;\ndeclare const attributeName: \'title\' | \'srcdoc\';\n' +
				'declare const value: string;\niframe.setAttribute( attributeName, value );\n',
			errors: [ {
				messageId: 'trustedAttribute',
				data: { name: 'setAttribute', attribute: 'srcdoc' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_ATTRIBUTE_HELPER + 'declare const iframe: HTMLIFrameElement;\n' +
						'declare const attributeName: \'title\' | \'srcdoc\';\ndeclare const value: string;\n' +
						'iframe.setAttribute( attributeName, _trustedAttributeValue( iframe, attributeName, value ) );\n'
				} ]
			} ]
		},

		{
			name: 'Setting an attribute with a name of a generic type whose constraint includes an event handler',
			code: 'declare const element: HTMLElement;\ndeclare const value: string;\n' +
				'function set<K extends \'id\' | \'onclick\'>( attributeName: K ) {\n' +
				'\telement.setAttribute( attributeName, value );\n}\n',
			errors: [ {
				messageId: 'trustedAttribute',
				data: { name: 'setAttribute', attribute: 'onclick' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_ATTRIBUTE_HELPER + 'declare const element: HTMLElement;\ndeclare const value: string;\n' +
						'function set<K extends \'id\' | \'onclick\'>( attributeName: K ) {\n' +
						'\telement.setAttribute( attributeName, _trustedAttributeValue( element, attributeName, value ) );\n}\n'
				} ]
			} ]
		},

		{
			name: 'Setting an attribute with a name built from a template literal',
			code: ATTRIBUTE_DECLARATIONS + 'declare const suffix: string;\nelement.setAttribute( `data-${ suffix }`, value );\n',
			errors: [ {
				messageId: 'dynamicAttribute',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_ATTRIBUTE_HELPER + ATTRIBUTE_DECLARATIONS + 'declare const suffix: string;\n' +
						'element.setAttribute( `data-${ suffix }`, _trustedAttributeValue( element, `data-${ suffix }`, value ) );\n'
				} ]
			} ]
		},

		{
			name: 'Setting a namespaced attribute with a name that can be any attribute',
			code: ATTRIBUTE_DECLARATIONS + 'declare const ns: string;\nelement.setAttributeNS( ns, attributeName, value );\n',
			errors: [ {
				messageId: 'dynamicAttribute',
				data: { name: 'setAttributeNS' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_ATTRIBUTE_HELPER + ATTRIBUTE_DECLARATIONS + 'declare const ns: string;\n' +
						'element.setAttributeNS( ns, attributeName, _trustedAttributeValue( element, attributeName, value ) );\n'
				} ]
			} ]
		},

		{
			name: 'Setting a namespaced event handler attribute with a prefix',
			code: ATTRIBUTE_DECLARATIONS + 'element.setAttributeNS( \'http://www.w3.org/2000/svg\', \'svg:onload\', value );\n',
			errors: [ {
				messageId: 'trustedAttribute',
				data: { name: 'setAttributeNS', attribute: 'svg:onload' },
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_ATTRIBUTE_HELPER + ATTRIBUTE_DECLARATIONS +
						'element.setAttributeNS( \'http://www.w3.org/2000/svg\', \'svg:onload\', ' +
						'_trustedAttributeValue( element, \'svg:onload\', value ) );\n'
				} ]
			} ]
		},

		{
			name: 'Calling the attribute helper with a different element, a different name, or too few arguments',
			code: ATTRIBUTE_DECLARATIONS + 'declare const other: Element;\n' +
				'element.setAttribute( attributeName, _trustedAttributeValue( other, attributeName, value ) );\n' +
				'element.setAttribute( attributeName, _trustedAttributeValue( element, \'title\', value ) );\n' +
				'element.setAttribute( attributeName, _trustedAttributeValue( value ) );\n',
			errors: [ 6, 7, 8 ].map( line => ( {
				messageId: 'attributeHelperMismatch',
				data: { name: 'setAttribute' },
				line
			} ) )
		},

		{
			name: 'Setting an attribute on an element returned by a call, which the suggestion would have to call twice',
			code: 'declare function getElement(): Element;\ndeclare const attributeName: string;\ndeclare const value: string;\n' +
				'getElement().setAttribute( attributeName, value );\n',
			errors: [ {
				messageId: 'dynamicAttribute',
				suggestions: []
			} ]
		},

		{
			name: 'Setting an attribute on an element behind assertions, which the suggestion keeps',
			code: ASSERTED_ELEMENT_CODE,
			errors: [ [ 'view.element!', 'view.element!.setAttribute' ], [ 'node as Element', '( node as Element ).setAttribute' ] ]
				.map( ( [ element, call ] ) => ( {
					messageId: 'dynamicAttribute',
					suggestions: [ {
						messageId: 'wrapInHelper',
						output: IMPORT_ATTRIBUTE_HELPER + ASSERTED_ELEMENT_CODE.replace(
							`${ call }( attributeName, value )`,
							`${ call }( attributeName, _trustedAttributeValue( ${ element }, attributeName, value ) )`
						)
					} ]
				} ) )
		},

		{
			name: 'Setting an attribute with an element and a name read from properties',
			code: 'declare const view: { element: HTMLElement; names: string[] };\ndeclare const value: string;\n' +
				'view.element.setAttribute( view.names[ 0 ], value );\n',
			errors: [ {
				messageId: 'dynamicAttribute',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: IMPORT_ATTRIBUTE_HELPER + 'declare const view: { element: HTMLElement; names: string[] };\n' +
						'declare const value: string;\n' +
						'view.element.setAttribute( view.names[ 0 ], _trustedAttributeValue( view.element, view.names[ 0 ], value ) );\n'
				} ]
			} ]
		},

		{
			name: 'Passing HTML to a function that writes it to a sink of its own, even through the helper, untyped, or in a union',
			options: [ { htmlWritingFunctions: { morphdom: 1 } } ],
			code: 'declare function morphdom( from: Node, to: Node | string ): void;\n' + DECLARATIONS +
				'declare const node: any;\ndeclare const nodeOrHtml: Node | string;\n' +
				'morphdom( element, html );\nmorphdom( element, trustedHtml( html ) );\nmorphdom( element, node );\n' +
				'morphdom( element, nodeOrHtml );\n',
			errors: [ 6, 7, 8, 9 ].map( line => ( {
				messageId: 'htmlWritingFunction',
				data: { name: 'morphdom' },
				line
			} ) )
		},

		{
			name: 'Wrapping a value in a file of the helpers module, which cannot import from its own name',
			filename: helpersModuleFilename,
			code: DECLARATIONS + 'element.innerHTML = html;\n',
			errors: [ {
				messageId: 'property',
				suggestions: [ {
					messageId: 'wrapInHelper',
					output: DECLARATIONS + 'element.innerHTML = trustedHtml( html );\n'
				} ]
			} ]
		}
	].map( withFilename )
} );

describe( 'require-trusted-types-for-sinks without type information', () => {
	it( 'throws an error that explains how to enable type information', () => {
		const linter = new Linter();

		expect( () => linter.verify( 'element.innerHTML = html;\n', {
			files: [ '**/*.ts' ],
			languageOptions: { parser: tsParser },
			plugins: { 'ckeditor5-rules': { rules: { 'require-trusted-types-for-sinks': rule } } },
			rules: { 'ckeditor5-rules/require-trusted-types-for-sinks': 'error' }
		}, 'file.ts' ) ).toThrow( /requires type information/ );
	} );
} );

function withFilename( testCase ) {
	return { filename, ...testCase };
}
