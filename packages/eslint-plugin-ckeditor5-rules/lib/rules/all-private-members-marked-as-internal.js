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
			description: 'Private identifiers must be marked as `@internal` so that they can be removed from tsc build.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		messages: {
			'markPrivateAsInternal': 'Private identifiers must be marked as `@internal`.'
		}
	},
	create( context ) {
		return {
			Identifier( node ) {
				const sourceCode = context.getSourceCode();

				if ( !isNonPublic( node, sourceCode ) || !isDeclaration( node, sourceCode ) ) {
					return;
				}

				const nodeJsdoc = getJSDocComment( sourceCode, node );

				if ( missingInternalTag( nodeJsdoc ) ) {
					context.report( {
						node,
						messageId: 'markPrivateAsInternal',
						fix( fixer ) {
							const newJsdoc = getNewJsdoc( nodeJsdoc.value );

							return fixer.replaceText( nodeJsdoc, newJsdoc );
						}
					} );
				}
			}
		};
	}
};

/**
 * @param {SourceCode} sourceCode
 * @param {ASTNode} node
 * @returns {Token|null}
 */
function getJSDocComment( sourceCode, node ) {
	const reducedNode = jsdocComment.getReducedASTNode( node, sourceCode );
	return findJSDocComment( reducedNode, sourceCode );
}

/**
 * Checks 5 tokens before a node in order to detect comments before e.g.
 * `declare public static readonly _myPrivateVariable`
 *
 * @param {ASTNode} astNode
 * @param {SourceCode} sourceCode
 * @returns {Token|null}
 */
function findJSDocComment( astNode, sourceCode ) {
	const tokenBeforeList = sourceCode.getTokensBefore( astNode, {
		count: 5,
		includeComments: true
	} );

	return tokenBeforeList.find( isCommentToken ) || null;
}

/**
 * @param {Token} token
 * @returns {Boolean}
 */
function isCommentToken( token ) {
	return token.type === 'Line' || token.type === 'Block' || token.type === 'Shebang';
}

/**
 * @param {String} comment
 * @returns {String}
 */
function getNewJsdoc( comment ) {
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
 * @param {ASTNode} nodeJsdoc
 * @returns {Boolean}
 */
function missingInternalTag( nodeJsdoc ) {
	return nodeJsdoc && nodeJsdoc.value && !nodeJsdoc.value.includes( '* ' + INTERNAL_TAG );
}

/**
 * @param {SourceCode} sourceCode
 * @param {ASTNode} astNode
 * @returns {Boolean}
 */
function isNonPublic( astNode, sourceCode ) {
	return astNode.name.startsWith( '_' ) || hasNonPublicModifier( sourceCode, astNode );
}

/**
 * @param {SourceCode} sourceCode
 * @param {ASTNode} astNode
 * @returns {Boolean}
 */
function isDeclaration( astNode, sourceCode ) {
	const [ tokenBefore ] = sourceCode.getTokensBefore( astNode, {
		count: 1
	} );

	return tokenBefore.value !== '.' && tokenBefore.value !== ':' && tokenBefore.value !== '(';
}

/**
 * @param {SourceCode} sourceCode
 * @param {ASTNode} astNode
 * @returns {Boolean}
 */
function hasNonPublicModifier( sourceCode, astNode ) {
	const tokenBeforeList = sourceCode.getTokensBefore( astNode, {
		count: 3,
		includeComments: true
	} );

	return tokenBeforeList.some( ( { value } ) => value === 'private' || value === 'protected' );
}
