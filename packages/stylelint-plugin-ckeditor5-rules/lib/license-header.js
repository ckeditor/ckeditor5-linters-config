/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

// Leading comment in a file will be considered license, and thus eligible
// for automatic fixing if it contains any of the strings below:
const LICENSE_IDENTIFIERS = [
	'Copyright',
	'copyright'
];

const stylelint = require( 'stylelint' );

const { report, ruleMessages } = stylelint.utils;

const ruleName = 'ckeditor5-rules/license-header';
const messages = ruleMessages( ruleName, {
	missingLicense: 'This file does not begin with a license header.',
	notLicense: 'This file begins with a comment that is not a license header.',
	incorrectContent: 'Incorrect license header content.',
	leadingSpacing: 'Disallowed gap before the license.',
	trailingSpacing: 'Missing empty line after the license.'
} );

module.exports.ruleName = ruleName;
module.exports.messages = messages;

module.exports = stylelint.createPlugin( ruleName, function ruleFunction( primaryOption, secondaryOptionObject, context ) {
	return function lint( root, result ) {
		// The file can not be empty.
		if ( !root.nodes.length ) {
			report( {
				ruleName,
				result,
				message: messages.missingLicense,
				line: 1
			} );

			return;
		}

		const firstNode = root.nodes[ 0 ];

		// The file has to begin with a comment.
		if ( firstNode.type !== 'comment' ) {
			report( {
				ruleName,
				result,
				message: messages.missingLicense,
				line: 1
			} );

			return;
		}

		// The comment on the beginning of the file needs to be a license.
		const commentIsLicense = LICENSE_IDENTIFIERS.some( identifier => firstNode.text.includes( identifier ) );

		if ( !commentIsLicense ) {
			report( {
				ruleName,
				result,
				message: messages.notLicense,
				line: 1
			} );

			return;
		}

		// The comment on the beginning of the file needs to have predefined content.
		const expectedFullComment = secondaryOptionObject.headerLines.join( context.newline );

		if ( firstNode.toString() !== expectedFullComment ) {
			if ( context.fix ) {
				// Removing leading `/*` and trailing `*/`.
				const commentContent = expectedFullComment.slice( 2, -2 );

				firstNode.text = commentContent;
				firstNode.raws.left = '';
				firstNode.raws.right = '';
			} else {
				report( {
					ruleName,
					result,
					message: messages.incorrectContent,
					node: firstNode
				} );
			}
		}

		// The comment has to start at the first line of the file.
		if ( firstNode.source.start.line !== 1 ) {
			if ( context.fix ) {
				firstNode.raws.before = '';
			} else {
				report( {
					ruleName,
					result,
					message: messages.leadingSpacing,
					line: 1
				} );
			}
		}

		// The comment has to have a empty line following it.
		const rawFileLines = root.source.input.css.split( context.newline );
		const expectedEmptyLineIndex = firstNode.source.end.line;
		const hasExpectedEmptyLine = rawFileLines[ expectedEmptyLineIndex ] === '';

		const secondNode = root.nodes[ 1 ];

		if ( !hasExpectedEmptyLine && secondNode ) {
			if ( context.fix ) {
				secondNode.raws.before = context.newline.repeat( 2 );
			} else {
				report( {
					ruleName,
					result,
					message: messages.trailingSpacing,
					line: firstNode.source.end.line,
					column: firstNode.source.end.column
				} );
			}
		}
	};
} );
