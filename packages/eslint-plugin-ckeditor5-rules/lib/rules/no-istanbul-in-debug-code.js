/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce CK_DEBUG and istanbul not appearing in the same line.',
			category: 'CKEditor5'
		}
	},

	create( context ) {
		const sourceCode = context.getSourceCode();

		return {
			Program( node ) {
				let comments = sourceCode.getComments( node.body[ 0 ] || node );
				comments = [ ...comments.leading, ...comments.trailing ];

				for ( const comment of comments ) {
					if ( comment.value.includes( 'CK_DEBUG' ) && comment.value.includes( 'istanbul' ) ) {
						context.report( {
							node: comment,
							message: 'Comments cannot have both CK_DEBUG and istanbul flags.'
						} );
					}
				}
			}
		};
	}
};
