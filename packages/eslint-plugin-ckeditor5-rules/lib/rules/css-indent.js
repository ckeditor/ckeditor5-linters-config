/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce tab indentation in CSS files.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			leadingSpace: 'Expected tab indentation, found leading space(s).'
		}
	},

	create( context ) {
		return {
			StyleSheet() {
				const sourceCode = context.sourceCode;
				const lines = sourceCode.lines;

				// Continuation lines of a multi-line block comment legitimately start
				// with ` *` (the canonical license-header pattern). Skip them.
				const commentContinuationLines = new Set();

				for ( const comment of sourceCode.comments || [] ) {
					for ( let line = comment.loc.start.line + 1; line <= comment.loc.end.line; line++ ) {
						commentContinuationLines.add( line );
					}
				}

				for ( let i = 0; i < lines.length; i++ ) {
					const lineNumber = i + 1;

					if ( commentContinuationLines.has( lineNumber ) ) {
						continue;
					}

					const line = lines[ i ];

					// Only flag lines that begin with a space and contain any
					// non-whitespace content. Lines that start with a tab - even
					// if followed by spaces for continuation alignment - are fine.
					if ( !/^ +\S/.test( line ) ) {
						continue;
					}

					const leadingSpaces = line.match( /^ +/ )[ 0 ].length;

					context.report( {
						loc: {
							start: { line: lineNumber, column: 0 },
							end: { line: lineNumber, column: leadingSpaces }
						},
						messageId: 'leadingSpace'
					} );
				}
			}
		};
	}
};
