/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const upath = require( 'upath' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require a file-level `@module` JSDoc tag that matches the file path.',
			category: 'CKEditor5',
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html'
		},
		messages: {
			missingModuleTag: [
				'Missing file-level {{ expected }} JSDoc tag.',
				'The `@module` annotation should be placed at the top of the file.'
			].join( ' ' ),
			invalidModuleTag: 'Expected file-level {{ expected }} JSDoc tag, but found {{ actual }}.'
		},
		schema: []
	},

	create( context ) {
		return {
			Program( node ) {
				const expectedModuleNames = getExpectedModuleNames( context.filename );

				if ( !expectedModuleNames ) {
					return;
				}

				const sourceCode = context.sourceCode;
				const moduleComment = getFileLevelModuleComment( node, sourceCode );
				const expectedModuleTag = formatExpectedModuleTag( expectedModuleNames );

				if ( !moduleComment ) {
					context.report( {
						node,
						messageId: 'missingModuleTag',
						data: {
							expected: expectedModuleTag
						}
					} );

					return;
				}

				const actualModuleName = getModuleTagValue( moduleComment );

				if ( actualModuleName && expectedModuleNames.includes( actualModuleName ) ) {
					return;
				}

				context.report( {
					node: moduleComment,
					messageId: 'invalidModuleTag',
					data: {
						expected: expectedModuleTag,
						actual: actualModuleName ? `\`@module ${ actualModuleName }\`` : '`@module`'
					}
				} );
			}
		};
	}
};

function getExpectedModuleNames( filename ) {
	const normalizedPath = upath.toUnix( filename );
	const match = normalizedPath.match( /(?:^|\/)packages\/([^/]+)\/src\/(.+)\.ts$/ );

	if ( !match ) {
		return null;
	}

	const packageName = match[ 1 ].replace( /^ckeditor5-/, '' );
	const relativePath = match[ 2 ];

	if ( relativePath === 'augmentation' ) {
		return null;
	}

	const canonicalModuleName = `${ packageName }/${ relativePath }`;
	const expectedModuleNames = [ canonicalModuleName ];

	if ( relativePath === 'index' || relativePath.endsWith( '/index' ) ) {
		expectedModuleNames.unshift( canonicalModuleName.replace( /\/index$/, '' ) );
	}

	return [ ...new Set( expectedModuleNames ) ];
}

function getFileLevelModuleComment( programNode, sourceCode ) {
	return getFileLevelJsDocComments( programNode, sourceCode ).find( comment => hasModuleTag( comment ) ) || null;
}

function getFileLevelJsDocComments( programNode, sourceCode ) {
	const [ firstNode ] = programNode.body;
	const comments = firstNode ? sourceCode.getCommentsBefore( firstNode ) : sourceCode.getAllComments();

	return comments.filter( comment => comment.type === 'Block' && comment.value.startsWith( '*' ) );
}

function hasModuleTag( comment ) {
	return /^\s*\*\s*@module\b/m.test( comment.value );
}

function getModuleTagValue( comment ) {
	const match = comment.value.match( /^\s*\*\s*@module\b(?:\s+([^\s]+))?/m );

	return match?.[ 1 ] || null;
}

function formatExpectedModuleTag( expectedModuleNames ) {
	return expectedModuleNames
		.map( moduleName => `\`@module ${ moduleName }\`` )
		.join( ' or ' );
}
