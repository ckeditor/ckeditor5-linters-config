/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * Compacts the `util.inspect` dump of lint messages in a `RuleTester` count-mismatch assertion
 * ("Should have no errors but had 1: [ { ruleId: ..., message: ..., ... } ]") to one
 * "line:column message" line per lint message. If the dump does not have the expected shape,
 * the original message is returned untouched.
 */
export function compactInspectedMessages( message ) {
	const openingBracketIndex = message.indexOf( '[' );

	if ( openingBracketIndex === -1 ) {
		return message;
	}

	const entries = [];

	for ( const chunk of extractTopLevelObjects( message.slice( openingBracketIndex ) ) ) {
		// The first occurrences are the lint message fields - nested `fix` and `suggestions`
		// data comes later in the inspected object.
		const text = chunk.match( /message: (['"])((?:\\.|(?!\1).)*?)\1,/ );
		const line = chunk.match( /\n\s*line: (\d+),/ );
		const column = chunk.match( /\n\s*column: (\d+),/ );

		if ( !text || !line || !column ) {
			return message;
		}

		entries.push( `  ${ line[ 1 ] }:${ column[ 1 ] }  ${ text[ 2 ] }` );
	}

	if ( entries.length === 0 ) {
		return message;
	}

	return message.slice( 0, openingBracketIndex ).trimEnd() + '\n' + entries.join( '\n' );
}

/**
 * Extracts the top-level `{ ... }` blocks of an inspected array, tracking brace depth and
 * string boundaries so that nested objects and braces inside quoted text do not break up
 * the blocks.
 */
function extractTopLevelObjects( text ) {
	const objects = [];
	let depth = 0;
	let start = -1;
	let quote = null;

	for ( let index = 0; index < text.length; index++ ) {
		const character = text[ index ];

		if ( quote ) {
			if ( character === '\\' ) {
				index++;
			} else if ( character === quote ) {
				quote = null;
			}

			continue;
		}

		if ( character === '\'' || character === '"' ) {
			quote = character;
		} else if ( character === '{' ) {
			if ( depth === 0 ) {
				start = index;
			}

			depth++;
		} else if ( character === '}' ) {
			depth--;

			if ( depth === 0 && start !== -1 ) {
				objects.push( text.slice( start, index + 1 ) );
				start = -1;
			}
		}
	}

	return objects;
}
