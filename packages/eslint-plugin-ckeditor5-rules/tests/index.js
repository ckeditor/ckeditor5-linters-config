/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'fs' );

console.log( '\n🔷 eslint-plugin-ckeditor5-rules - running tests.\n' );

const tests = fs.readdirSync( __dirname ).filter( test => {
	return test !== 'index.js';
} );

for ( const test of tests ) {
	require( `./${ test }` );
}

console.log( '✅ eslint-plugin-ckeditor5-rules - tests passed with no errors.\n' );
