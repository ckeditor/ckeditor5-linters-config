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
			description: 'Disallow editor styles in `theme/index-content.css`.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			editorStyleInIndexContent: 'Editor styles must not be placed in `theme/index-content.css`.'
		}
	},

	create( context ) {
		if ( !isIndexContentFile( context.filename ) ) {
			return {};
		}

		return createSelectorVisitors( ( node, kinds ) => {
			if ( kinds.has( 'editor' ) ) {
				context.report( {
					node,
					messageId: 'editorStyleInIndexContent'
				} );
			}
		} );
	}
};
