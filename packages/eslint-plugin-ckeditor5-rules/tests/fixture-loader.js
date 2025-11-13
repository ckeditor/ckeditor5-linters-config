/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const fs = require( 'node:fs' );
const upath = require( 'upath' );
const _ = require( 'lodash' );

module.exports = function fixtureLoader( ruleName ) {
	const cwd = upath.join( __dirname, 'fixtures', ruleName );

	return fs.globSync( '**/*.js', { cwd } )
		.map( upath.normalize )
		.reduce( ( result, fixtureRelativePath ) => {
			const fixtureKey = fixtureRelativePath
				.replace( '.js', '' )
				.replace( /-/g, '_' )
				.split( upath.sep );

			const fixturePath = upath.join( cwd, fixtureRelativePath );
			const fixtureContent = fs.readFileSync( fixturePath, 'utf-8' );

			return _.set( result, fixtureKey, {
				path: fixturePath,
				content: fixtureContent
			} );
		}, {} );
};
