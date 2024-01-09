/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow using the `@if CK_DEBUG_*` and `istanbul` keywords in the same line.',
			category: 'CKEditor5'
		}
	},

	create( context ) {
		return {
			Program() {
				const source = context.getSourceCode();
				const comments = source.getAllComments();

				for ( const comment of comments ) {
					if ( comment.value.includes( 'CK_DEBUG' ) && comment.value.includes( 'istanbul' ) ) {
						context.report( {
							node: comment,
							message: 'Comments cannot have both `@if CK_DEBUG_*` and `istanbul` keywords in the same line.'
						} );
					}
				}
			}
		};
	}
};
