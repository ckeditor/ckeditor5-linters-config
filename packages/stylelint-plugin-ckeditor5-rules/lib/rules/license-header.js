/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

// Leading comment in a file will be considered license, and thus eligible
// for automatic fixing if it contains any of the strings below:
const LICENSE_IDENTIFIERS = [
	'@license',
	'Copyright',
	'copyright'
];

const stylelint = require( 'stylelint' );

const { report, ruleMessages } = stylelint.utils;

const ruleName = 'ckeditor5-plugin/enforce-license';
const messages = ruleMessages( ruleName, {
	missing: () => 'This file does not begin with a license header.',
	notLicense: () => 'This file begins with a comment that is not a license header.',
	content: () => 'Incorrect license header content.',
	spacing: () => 'Incorrect license header spacing.'
} );

module.exports.ruleName = ruleName;
module.exports.messages = messages;

module.exports = stylelint.createPlugin( ruleName, function ruleFunction( primaryOption, secondaryOptionObject, context ) {
	const newline = context.newline || '\n';
	const expectedHeader = secondaryOptionObject.headerContent.join( newline );
	const expectedLeftRaw = newline;
	const expectedRightRaw = newline + ' ';

	return function lint( root, result ) {
		const firstNode = root.nodes[ 0 ];

		// The file has to begin with a comment.
		if ( firstNode.type !== 'comment' ) {
			report( {
				ruleName,
				result,
				message: messages.missing(),
				line: 0
			} );

			return;
		}

		// The comment on the beginning of the file needs to be a license.
		const commentIsLicense = LICENSE_IDENTIFIERS.some( identifier => firstNode.text.includes( identifier ) );

		if ( !commentIsLicense ) {
			report( {
				ruleName,
				result,
				message: messages.notLicense(),
				node: firstNode
			} );

			return;
		}

		// The comment on the beginning of the file needs to have predefined content.
		if ( firstNode.text !== expectedHeader ) {
			if ( context.fix ) {
				firstNode.text = expectedHeader;
			} else {
				report( {
					ruleName,
					result,
					message: messages.content(),
					node: firstNode
				} );
			}
		}

		// The comment on the beginning of the file needs to begin with correct spacing.
		if ( firstNode.raws.left !== expectedLeftRaw ) {
			if ( context.fix ) {
				firstNode.raws.left = expectedLeftRaw;
			} else {
				report( {
					ruleName,
					result,
					message: messages.spacing(),
					node: firstNode
				} );
			}
		}

		// The comment on the beginning of the file needs to end with correct spacing.
		if ( firstNode.raws.right !== expectedRightRaw ) {
			if ( context.fix ) {
				firstNode.raws.right = expectedRightRaw;
			} else {
				report( {
					ruleName,
					result,
					message: messages.spacing(),
					node: firstNode
				} );
			}
		}
	};
} );
