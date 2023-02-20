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

				if ( !isNonPublic( node, sourceCode ) ) {
					return;
				}

				const nodeJsdoc = getJSDocComment( sourceCode, node );

				// TODO make sure that only declarations are checked
				if ( containsInternalKeyword( nodeJsdoc ) ) {
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
 * Retrieves the JSDoc comment for a given node.
 *
 * @param {SourceCode} sourceCode The ESLint SourceCode
 * @param {ASTNode} node The AST node to get the comment for.
 * @returns {Token|null} The Block comment token containing the JSDoc comment
 *    for the given node or null if not found.
 */
function getJSDocComment( sourceCode, node ) {
	const reducedNode = jsdocComment.getReducedASTNode( node, sourceCode );
	return findJSDocComment( reducedNode, sourceCode );
}

/**
 * Checks for the presence of a JSDoc comment for the given node and returns it.
 *
 * @param {ASTNode} astNode The AST node to get the comment for.
 * @param {SourceCode} sourceCode
 * @returns {Token|null} The Block comment token containing the JSDoc comment
 *    for the given node or null if not found.
 */
function findJSDocComment( astNode, sourceCode ) {
	let currentNode = astNode;
	let tokenBefore = null;
	while ( currentNode ) {
		const decorator = jsdocComment.getDecorator( currentNode );

		if ( decorator ) {
			currentNode = decorator;
		}

		tokenBefore = sourceCode.getTokenBefore( currentNode, {
			includeComments: true
		} );

		if ( tokenBefore ) {
			[ tokenBefore ] = sourceCode.getTokensBefore( currentNode, {
				count: 2,
				includeComments: true
			} );
		}

		if ( !tokenBefore || !isCommentToken( tokenBefore ) ) {
			return null;
		}

		if ( tokenBefore.type === 'Line' ) {
			currentNode = tokenBefore;
			continue;
		}

		break;
	}

	if ( tokenBefore.type === 'Block' && /^\*\s/u.test( tokenBefore.value ) ) {
		return tokenBefore;
	}

	return null;
}

/**
 * Checks if the given token is a comment token or not.
 *
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a comment token.
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
 * @returns {boolean}
 */
function containsInternalKeyword( nodeJsdoc ) {
	return nodeJsdoc && nodeJsdoc.value && !nodeJsdoc.value.includes( '* ' + INTERNAL_TAG );
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @returns {boolean}
 */
function isNonPublic( node = '', sourceCode ) {
	return node.name.startsWith( '_' ) || hasNonPublicModifier( sourceCode, node );
}

/**
 * @param {SourceCode} sourceCode
 * @param {ASTNode} node
 * @param {Number} [depth=3]
 * @returns {boolean}
 */
function hasNonPublicModifier( sourceCode, node, depth = 3 ) {
	const tokenBefore = sourceCode.getTokenBefore( node );

	if ( !tokenBefore ) {
		return false;
	}

	if ( depth && ( tokenBefore.value !== 'private' && tokenBefore.value !== 'protected' ) ) {
		return hasNonPublicModifier( sourceCode, tokenBefore, depth - 1 );
	}

	return tokenBefore.value === 'private' || tokenBefore.value === 'protected';
}
