/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow using import for functions used in debug mode.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		messages: {
			'usingImportNotAllowed': 'Using import with "@if CK_DEBUG" keyword is not allowed. Please Use require().'
		},
		schema: []
	},
	create( context ) {
		return {
			Program() {
				const source = context.getSourceCode();
				const comments = source.getAllComments();

				for ( const comment of comments ) {
					if ( debugCommentDoesNotContainImport( comment.value ) ) {
						continue;
					}

					context.report( {
						node: comment,
						messageId: 'usingImportNotAllowed',
						fix( fixer ) {
							const commentPrefix = comment.type === 'Line' ? '//' : '/*';
							const commentSuffix = comment.type === 'Line' ? '' : '*/';
							const regex = /import (.*) from (.*)?;/;
							const replaceVal = 'const $1 = require($2);';
							const newCommentText = commentPrefix + comment.value.replace( regex, replaceVal ) + commentSuffix;
							return fixer.replaceText( comment, newCommentText );
						}
					} );
				}
			}
		};
	}
};

/**
 * @param {String} [str='']
 * @return {Boolean}
 */
function debugCommentDoesNotContainImport( str = '' ) {
	return !/@if CK_DEBUG \/\/ import .* from .*/.test( str );
}
