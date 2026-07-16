/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it } from 'vitest';
import { RuleTester } from 'eslint';
import { compactInspectedMessages } from './compact-inspected-messages.mjs';

/**
 * `RuleTester` failures explain themselves in the assertion message. Strip the noise Vitest
 * would print around it: a lengths-only diff and stack frames pointing into ESLint internals.
 */
function cleanRuleTesterError( error ) {
	if ( !error || typeof error !== 'object' ) {
		throw error;
	}

	// Count mismatch: drop the number-vs-number diff (string diffs stay) and tidy the message.
	if ( typeof error.actual === 'number' && typeof error.expected === 'number' ) {
		delete error.actual;
		delete error.expected;
		delete error.diff;

		// Node appends the raw comparison ("1 !== 0") to the message.
		error.message = error.message.replace( /\n\n\d+ !== \d+\n?$/, '' );

		// One shared message for all "reported nothing" failures, so Vitest groups them.
		error.message = error.message.replace(
			/^Should have \d+ errors? but had 0: \[\]$/,
			'Should have errors but reported none.'
		);

		error.message = compactInspectedMessages( error.message );
	}

	if ( typeof error.stack !== 'string' ) {
		throw error;
	}

	// Drop ESLint-internal frames and sync the stack header with the rewritten message -
	// Vitest groups identical failures by comparing stacks.
	const frames = error.stack
		.split( '\n' )
		.filter( line => /^\s+at /.test( line ) && !/at .*rule-tester/.test( line ) );

	error.stack = [ `${ error.name }: ${ error.message }`, ...frames ].join( '\n' );

	throw error;
}

/**
 * Unnamed cases use their code as the title - render their whitespace as escape sequences.
 */
function escapeTitleWhitespace( title ) {
	return title
		.replace( /\\u0009|\t/g, '\\t' )
		.replace( /\n/g, '\\n' );
}

function wrapCase( testFunction ) {
	return ( title, method ) => testFunction( escapeTitleWhitespace( title ), () => {
		try {
			return method();
		} catch ( error ) {
			cleanRuleTesterError( error );
		}
	} );
}

RuleTester.describe = describe;
RuleTester.it = wrapCase( it );
RuleTester.itOnly = wrapCase( it.only );
