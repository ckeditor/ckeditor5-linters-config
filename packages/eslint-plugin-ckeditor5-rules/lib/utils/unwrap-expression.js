/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const EXPRESSION_WRAPPERS = new Set( [
	'ChainExpression',
	'TSAsExpression',
	'TSNonNullExpression',
	'TSSatisfiesExpression',
	'TSTypeAssertion'
] );

/**
 * Strips TypeScript wrapper nodes (`x as Document`, `x!`, `<Document>x`, `x satisfies Document`),
 * and `ChainExpression` wrappers (parenthesized optional chains, e.g. `(x?.y)`) down to the
 * expression underneath, since none changes what is actually being accessed or called.
 *
 * unwrapExpression( node ); // node for `document!` -> node for `document`
 */
function unwrapExpression( node ) {
	let expression = node;

	while ( EXPRESSION_WRAPPERS.has( expression?.type ) ) {
		expression = expression.expression;
	}

	return expression;
}

module.exports = { unwrapExpression };
