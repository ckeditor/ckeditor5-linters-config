/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const jsdocComment = require( '@es-joy/jsdoccomment' );

const INTERNAL_TAG = '@internal';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Non-public identifiers must be marked as `@internal` so that they can be removed from typings.',
			category: 'CKEditor5',
			// eslint-disable-next-line max-len
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#non-public-members-marked-as-internal-ckeditor5-rulesnon-public-members-as-internal'
		},
		fixable: 'code',
		messages: {
			'markPrivateAsInternal': 'Non-public identifiers must be marked as `@internal`.'
		}
	},
	create( context ) {
		return {
			Identifier( node ) {
				const sourceCode = context.getSourceCode();

				if ( !isNonPublic( node, sourceCode ) || !isDeclaration( node, sourceCode ) ) {
					return;
				}

				const nodeJsDoc = getJsDocComment( sourceCode, node );

				if ( !nodeJsDoc ) {
					context.report( {
						node,
						messageId: 'markPrivateAsInternal',
						fix( fixer ) {
							const firstLineNode = getFirstNodeInline( node, sourceCode );
							const jsDoc = generateNewJsDoc( firstLineNode );

							return fixer.insertTextBefore( firstLineNode, jsDoc );
						}
					} );
				}

				if ( missingInternalTag( nodeJsDoc ) ) {
					context.report( {
						node,
						messageId: 'markPrivateAsInternal',
						fix( fixer ) {
							const jsDoc = modifyJsDoc( nodeJsDoc.value );

							return fixer.replaceText( nodeJsDoc, jsDoc );
						}
					} );
				}
			}
		};
	}
};

/**
 * @param {SourceCode} sourceCode
 * @param {AST.Token} node
 * @returns {Token|null}
 */
function getJsDocComment( sourceCode, node ) {
	const reducedNode = jsdocComment.getReducedASTNode( node, sourceCode );
	return findJsDocComment( reducedNode, sourceCode );
}

/**
 * Checks 5 tokens before a node in order to detect comments before e.g.
 * `declare public static readonly _myPrivateVariable`
 *
 * @param {AST.Token} astNode
 * @param {SourceCode} sourceCode
 * @returns {Token|null}
 */
function findJsDocComment( astNode, sourceCode ) {
	const tokenBeforeList = sourceCode.getTokensBefore( astNode, {
		count: 5,
		includeComments: true
	} ).reverse();

	for ( const token of tokenBeforeList ) {
		// if token is equal to `{` that means we are moving outside current code block
		if ( token.value === '{' ) {
			return null;
		}

		if ( isCommentToken( token ) ) {
			return token;
		}
	}

	return null;
}

/**
 * @param {AST.Token} node
 * @param {SourceCode} sourceCode
 * @returns {AST.Token}
 */
function getFirstNodeInline( node, sourceCode ) {
	const [ firstInLine ] = sourceCode.getTokensBefore( node, {
		count: 4,
		includeComments: true
	} ).filter( token => token.loc.start.line === node.loc.start.line );

	return firstInLine || node;
}

/**
 * @param {AST.Token} node
 * @returns {string}
 */
function generateNewJsDoc( firstLineNode ) {
	const column = firstLineNode.loc.start.column;
	const indent = '\t'.repeat( column );
	const jsDoc = '/**\n' +
		indent + ' * ' + INTERNAL_TAG + '\n' +
		indent + ' */\n' +
		indent;

	return jsDoc;
}

/**
 * @param {String} comment
 * @returns {String}
 */
function modifyJsDoc( comment ) {
	const indent = getFirstLineIndent( comment );
	const commentFirstTag = comment.match( /\* @[a-z]+/ );

	if ( commentFirstTag ) {
		return '/*' + comment.substring( 0, commentFirstTag.index ) +
			'* ' + INTERNAL_TAG + '\n' +
			indent + comment.substring( commentFirstTag.index ) + '*/';
	}

	return '/*' + comment + '*\n' +
		indent + '* ' + INTERNAL_TAG + '\n' +
		indent + '*/';
}

/**
 * @param {String} comment
 * @returns {String}
 */
function getFirstLineIndent( comment ) {
	return comment.match( /([\s]+)/g )[ 0 ].replace( '\n', '' );
}

/**
 * @param {Token} token
 * @returns {Boolean}
 */
function isCommentToken( token ) {
	return token.type === 'Line' || token.type === 'Block' || token.type === 'Shebang';
}

/**
 * @param {AST.Token} nodeJsdoc
 * @returns {Boolean}
 */
function missingInternalTag( nodeJsdoc ) {
	return nodeJsdoc && nodeJsdoc.value && !nodeJsdoc.value.includes( '* ' + INTERNAL_TAG );
}

/**
 * @param {SourceCode} sourceCode
 * @param {AST.Token} astNode
 * @returns {Boolean}
 */
function isNonPublic( astNode, sourceCode ) {
	return astNode.name.startsWith( '_' ) || hasNonPublicModifier( sourceCode, astNode );
}

/**
 * @param {SourceCode} sourceCode
 * @param {AST.Token} astNode
 * @returns {Boolean}
 */
function isDeclaration( astNode, sourceCode ) {
	const requiredTokens = [ 'private', 'public', 'protected', 'static', 'get', 'readonly', 'function' ];
	const [ tokenBefore ] = sourceCode.getTokensBefore( astNode, {
		count: 1
	} );

	return !!requiredTokens.find( token => tokenBefore.value === token );
}

/**
 * @param {SourceCode} sourceCode
 * @param {AST.Token} astNode
 * @returns {Boolean}
 */
function hasNonPublicModifier( sourceCode, astNode ) {
	const tokenBeforeList = sourceCode.getTokensBefore( astNode, {
		count: 3,
		includeComments: true
	} );

	return tokenBeforeList.some( ( { value } ) => value === 'private' || value === 'protected' );
}
