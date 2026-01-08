/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce the presence of a @license header.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					headerLines: {
						type: 'array'
					}
				},
				additionalProperties: false
			}
		]
	},

	create( context ) {
		const [ { headerLines } = {} ] = context.options;

		if ( !headerLines ) {
			console.error( 'The license-header rule is missing the "headerLines" configuration.' );
		}

		return {
			Program() {
				licenseHeaderRule( context, headerLines );
			}
		};
	}
};

function licenseHeaderRule( context, headerLines ) {
	const headerText = headerLines.join( '\n' );
	const sourceCode = context.sourceCode;
	const fullSourceString = sourceCode.lines.join( '\n' );

	const comments = sourceCode.getAllComments();
	const shebang = comments.find( comment => comment.type === 'Shebang' );
	const licenseComment = comments.find( comment => comment.type === 'Block' && comment.value.toLowerCase().includes( '@license' ) );

	if ( !licenseComment ) {
		const line = shebang ? 2 : 0;

		context.report( {
			loc: {
				start: {
					line,
					column: 0
				},
				end: {
					line,
					column: 0
				}
			},
			message: 'The license header is missing.',
			fix: fixer => {
				return shebang ?
					fixer.insertTextAfter( shebang, '\n\n' + headerText + '\n\n' ) :
					fixer.insertTextAfterRange( [ 0, 0 ], headerText + '\n\n' );
			}
		} );

		// If there is no license header or we just created it, there is no need for other checks.
		return;
	}

	if ( sourceCode.getText( licenseComment ) !== headerText ) {
		context.report( {
			node: licenseComment,
			message: 'The license header is incorrect.',
			fix: fixer => fixer.replaceTextRange( licenseComment.range, headerText )
		} );
	}

	const contentBeforeStart = shebang ? shebang.range[ 1 ] : 0;
	const contentBeforeRange = [ contentBeforeStart, licenseComment.range[ 0 ] ];
	const contentBefore = fullSourceString.slice( ...contentBeforeRange );
	const whitespaceOnly = /^\s+$/.test( contentBefore );
	const expectedContentBefore = shebang ? '\n\n' : '';

	const contentBeforeLoc = {
		start: {
			line: 0,
			column: shebang ? shebang.loc.end.column : 0
		},
		end: {
			line: licenseComment.loc.start.line,
			column: licenseComment.loc.start.column
		}
	};

	if ( contentBefore !== expectedContentBefore && whitespaceOnly ) {
		context.report( {
			loc: contentBeforeLoc,
			message: 'Incorrect whitespace before the license header.',
			fix: fixer => fixer.replaceTextRange( contentBeforeRange, expectedContentBefore )
		} );
	} else if ( contentBefore !== expectedContentBefore && !whitespaceOnly ) {
		context.report( {
			loc: contentBeforeLoc,
			message: 'Unexpected content before the license header.'
		} );
	}

	const followingToken = sourceCode.getTokenAfter( licenseComment, { includeComments: true } );

	if ( !followingToken ) {
		return;
	}

	const contentBetween = fullSourceString.slice( licenseComment.range[ 1 ], followingToken.range[ 0 ] );

	if ( !contentBetween.startsWith( '\n\n' ) ) {
		context.report( {
			loc: {
				start: {
					line: licenseComment.loc.end.line,
					column: licenseComment.loc.end.column
				},
				end: {
					line: followingToken.loc.start.line,
					column: followingToken.loc.start.column
				}
			},
			message: 'Incorrect whitespace after the license header.',
			fix: fixer => fixer.replaceTextRange( [ licenseComment.range[ 1 ], followingToken.range[ 0 ] ], '\n\n' )
		} );
	}
}
