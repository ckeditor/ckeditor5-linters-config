/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { compactInspectedMessages } from './compact-inspected-messages.mjs';

// Builds the assertion message the same way `RuleTester` does: a prefix followed by the
// `util.inspect` dump of the lint messages.
function buildMessage( lintMessages ) {
	return `Should have no errors but had ${ lintMessages.length }: ${ inspect( lintMessages ) }`;
}

function lintMessage( overrides ) {
	return {
		ruleId: 'rule-to-test/example',
		severity: 1,
		message: 'Plain report.',
		line: 1,
		column: 8,
		nodeType: 'Identifier',
		messageId: 'example',
		endLine: 1,
		endColumn: 12,
		...overrides
	};
}

describe( 'compactInspectedMessages', () => {
	it( 'compacts a single message to a "line:column message" line', () => {
		const result = compactInspectedMessages( buildMessage( [ lintMessage( {} ) ] ) );

		expect( result ).toBe( 'Should have no errors but had 1:\n  1:8  Plain report.' );
	} );

	it( 'keeps multiple messages separate', () => {
		const result = compactInspectedMessages( buildMessage( [
			lintMessage( { message: 'First report.', line: 1, column: 1 } ),
			lintMessage( { message: 'Second report.', line: 2, column: 5 } )
		] ) );

		expect( result ).toBe( 'Should have no errors but had 2:\n  1:1  First report.\n  2:5  Second report.' );
	} );

	it( 'does not mix messages when one contains an autofix', () => {
		const result = compactInspectedMessages( buildMessage( [
			lintMessage( { message: 'Fixable report.', line: 1, column: 1, fix: { range: [ 0, 7 ], text: 'fixed {}' } } ),
			lintMessage( { message: 'Plain report.', line: 1, column: 8 } )
		] ) );

		expect( result ).toBe( 'Should have no errors but had 2:\n  1:1  Fixable report.\n  1:8  Plain report.' );
	} );

	it( 'does not mix messages when one contains suggestions', () => {
		const result = compactInspectedMessages( buildMessage( [
			lintMessage( {
				message: 'Report with suggestions.',
				line: 3,
				column: 2,
				suggestions: [ { messageId: 'suggestion', desc: 'Use { instead.', fix: { range: [ 1, 2 ], text: '{' } } ]
			} ),
			lintMessage( { message: 'Plain report.', line: 4, column: 6 } )
		] ) );

		expect( result ).toBe( 'Should have no errors but had 2:\n  3:2  Report with suggestions.\n  4:6  Plain report.' );
	} );

	it( 'handles quoted text resembling the inspected structure inside a message', () => {
		const result = compactInspectedMessages( buildMessage( [
			lintMessage( { message: 'Tricky \'quoted\', line: 9, column: 9 report.', line: 5, column: 3 } )
		] ) );

		expect( result ).toBe(
			'Should have no errors but had 1:\n  5:3  Tricky \'quoted\', line: 9, column: 9 report.'
		);
	} );

	it( 'compacts a minimal object rendered on a single line', () => {
		const original = `Should have no errors but had 1: ${ inspect( [ { message: 'x', line: 3, column: 7 } ] ) }`;

		// Guards the premise: `util.inspect` renders an object this small on one line.
		expect( original ).not.toContain( '\n' );

		expect( compactInspectedMessages( original ) ).toBe( 'Should have no errors but had 1:\n  3:7  x' );
	} );

	it( 'compacts a multi-line object whose last property is `column`', () => {
		const result = compactInspectedMessages( buildMessage( [ {
			ruleId: 'rule-to-test/example',
			severity: 1,
			message: 'A long enough report message to force util.inspect into multi-line mode for this object.',
			line: 2,
			column: 4
		} ] ) );

		expect( result ).toBe(
			'Should have no errors but had 1:\n' +
			'  2:4  A long enough report message to force util.inspect into multi-line mode for this object.'
		);
	} );

	it( 'returns a message without a dump untouched', () => {
		expect( compactInspectedMessages( 'Should have errors but reported none.' ) )
			.toBe( 'Should have errors but reported none.' );
	} );

	it( 'returns a message with an empty dump untouched', () => {
		expect( compactInspectedMessages( 'Should have 2 errors but had 0: []' ) )
			.toBe( 'Should have 2 errors but had 0: []' );
	} );

	it( 'returns the original message when a dumped object misses expected fields', () => {
		const original = `Should have no errors but had 1: ${ inspect( [ { unexpected: true } ] ) }`;

		expect( compactInspectedMessages( original ) ).toBe( original );
	} );
} );
