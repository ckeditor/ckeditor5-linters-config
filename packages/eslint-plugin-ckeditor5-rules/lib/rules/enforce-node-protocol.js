/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { isBuiltin } = require( 'node:module' );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require \'node:\' prefix for built-in Node modules.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		schema: [],
		messages: {
			missingPrefix: 'Use \'node:\' prefix for built-in module \'{{name}}\'.'
		}
	},
	create( context ) {
		return {
			// Handle `import ... from 'source'` declarations.
			ImportDeclaration: node => handleImport( node, context ),

			// Handle dynamic `import()` calls.
			ImportExpression: node => handleImport( node, context ),

			// Handle `require()` calls.
			CallExpression: node => handleRequire( node, context )
		};
	}
};

/**
 * Handle import declarations and dynamic import expressions.
 */
function handleImport( { source }, context ) {
	const value = source.value;

	if (
		typeof value !== 'string' ||
		value.startsWith( 'node:' ) ||
		!isBuiltin( 'node:' + value )
	) {
		return;
	}

	context.report( {
		node: source,
		messageId: 'missingPrefix',
		data: { name: value },
		fix: fixer => fixer.replaceText( source, `'node:${ value }'` )
	} );
}

/**
 * Handle require() calls.
 */
function handleRequire( { callee, arguments: args }, context ) {
	if (
		callee.type !== 'Identifier' ||
		callee.name !== 'require' ||
		args[ 0 ]?.type !== 'Literal'
	) {
		return;
	}

	const value = args[ 0 ].value;

	if ( value.startsWith( 'node:' ) || !isBuiltin( 'node:' + value ) ) {
		return;
	}

	context.report( {
		node: args[ 0 ],
		messageId: 'missingPrefix',
		data: { name: value },
		fix: fixer => fixer.replaceText( args[ 0 ], `'node:${ value }'` )
	} );
}
