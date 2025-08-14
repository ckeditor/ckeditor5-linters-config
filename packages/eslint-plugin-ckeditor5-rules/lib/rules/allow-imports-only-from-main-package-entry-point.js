/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const message = 'Importing from "@ckeditor/*" packages is only allowed from the main package entry point.';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Allow importing from "@ckeditor/*" modules only from the main package entry point.',
			category: 'CKEditor5',
			// eslint-disable-next-line @stylistic/max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#importing-from-modules-ckeditor5-rulesallow-imports-only-from-main-package-entry-point'
		},
		fixable: 'code',
		schema: []
	},
	create( context ) {
		return {
			ImportDeclaration( node ) {
				if ( node.specifiers.length === 0 ) {
					// Ignore side-effect imports like "import '/modules/my-module.js'".
					return;
				}

				const path = node.source.value;
				const match = path.match( /@ckeditor\/[^/]+/ );

				if ( !match ) {
					// Ignore imports that do not match with the '@ckeditor/package-name' pattern.
					return;
				}

				if ( path === match[ 0 ] ) {
					// Ignore imports from the main package entry point.
					return;
				}

				const isTestUtil = path.match( /@ckeditor\/[^/]+\/tests\/_utils\// );

				if ( isTestUtil ) {
					return;
				}

				const defaultImport = node.specifiers.find( item => item.type === 'ImportDefaultSpecifier' );
				const namedImport = node.specifiers.find( item => item.type === 'ImportSpecifier' );

				// If import uses both default and named imports, we don't know how to fix it.
				if ( defaultImport && namedImport ) {
					return context.report( { node, message } );
				}

				context.report( {
					node,
					message,
					fix: fixer => {
						const fixes = [
							fixer.replaceTextRange( node.source.range, `'${ match[ 0 ] }'` )
						];

						if ( defaultImport ) {
							fixes.push( fixer.replaceTextRange( defaultImport.range, `{ ${ defaultImport.local.name } }` ) );
						}

						return fixes;
					}
				} );
			}
		};
	}
};
