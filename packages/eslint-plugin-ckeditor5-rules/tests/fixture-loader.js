/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const fs = require( 'fs' );
const path = require( 'path' );

const fixtureTypes = [
	'valid',
	'invalid'
];

module.exports = function fixtureLoader( ruleName ) {
	const fixtures = {};

	for ( const fixtureType of fixtureTypes ) {
		const typeDir = path.join( __dirname, 'fixtures', ruleName, fixtureType );

		fixtures[ fixtureType ] = fs.readdirSync( typeDir ).reduce( ( output, filename ) => {
			const fixturePath = path.join( typeDir, filename );
			const fixtureContent = fs.readFileSync( fixturePath, 'utf-8' );
			const fixtureKey = filename
				.replace( '.js', '' )
				.replace( /-/g, '_' );

			output[ fixtureKey ] = fixtureContent;

			return output;
		}, {} );
	}

	return fixtures;
};
