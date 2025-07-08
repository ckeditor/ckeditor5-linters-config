/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const SELECTOR = '.ck-content';
const PREFIX = '--ck-content';

const stylelint = require( 'stylelint' );

const { report, ruleMessages } = stylelint.utils;

const ruleName = 'ckeditor5-rules/ck-content-variable-name';
const messages = ruleMessages( ruleName, {
	invalidSelector: `Variables inside the '${ SELECTOR }' selector have to use the '${ PREFIX }-*' prefix.`
} );

module.exports.ruleName = ruleName;
module.exports.messages = messages;

module.exports = stylelint.createPlugin( ruleName, () => {
	return ( root, result ) => parseNodes( result, root.nodes );
} );

function parseNodes( result, nodes = [], isInsideMatchingSelector = false ) {
	nodes.forEach( node => {
		parseNodes(
			result,
			node.nodes,
			isInsideMatchingSelector || node.selector?.includes( SELECTOR )
		);

		if ( !isInsideMatchingSelector ) {
			return;
		}

		if ( node.type !== 'decl' ) {
			return;
		}

		if ( !node.value.startsWith( 'var(' ) ) {
			return;
		}

		if ( node.value.startsWith( 'var(' + PREFIX ) ) {
			return;
		}

		report( {
			message: messages.invalidSelector,
			ruleName,
			result,
			node
		} );
	} );
}
