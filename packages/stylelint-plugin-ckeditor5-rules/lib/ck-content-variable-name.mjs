/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import stylelint from 'stylelint';

const {
	createPlugin,
	utils: { report, ruleMessages }
} = stylelint;

const SELECTOR = '.ck-content';
const PREFIX = '--ck-content-';
const IGNORED_VARIABLES = [
	'-suggestion-',
	'-comment-'
];

const ruleName = 'ckeditor5-rules/ck-content-variable-name';
const messages = ruleMessages( ruleName, {
	invalidSelector: `Variables inside the '${ SELECTOR }' selector have to use the '${ PREFIX }*' prefix.`
} );

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin( ruleName, ruleFunction );

function ruleFunction() {
	return ( root, result ) => parseNodes( result, root.nodes );
}

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

		if ( node.value.match( new RegExp( `var\\(\\s*?${ PREFIX }` ) ) ) {
			return;
		}

		if ( IGNORED_VARIABLES.some( ignored => node.value.includes( ignored ) ) ) {
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
