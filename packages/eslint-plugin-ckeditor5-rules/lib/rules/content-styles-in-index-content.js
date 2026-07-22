/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { createSelectorVisitors, isIndexContentFile } = require( '../utils/content-style-selectors' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require content styles to be placed in `theme/index-content.css`.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			contentStyleOutsideIndexContent: 'Content styles must be placed in `theme/index-content.css`.'
		}
	},

	create( context ) {
		if ( isIndexContentFile( context.filename ) ) {
			return {};
		}

		return createSelectorVisitors( ( node, kinds ) => {
			if ( kinds.has( 'content' ) ) {
				context.report( {
					node,
					messageId: 'contentStyleOutsideIndexContent'
				} );
			}
		} );
	}
};
