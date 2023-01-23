/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'fs' );

const tests = fs.readdirSync( __dirname ).filter( test => {
	return test !== 'index.js';
} );

for ( const test of tests ) {
	console.log( `Testing "${ test }"...` );

	require( `./${ test }` );
}

console.log( 'OK!' );
