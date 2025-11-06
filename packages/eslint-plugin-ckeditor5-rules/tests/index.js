/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'node:fs' );
const path = require( 'node:path' );

const tests = fs.readdirSync( path.join( __dirname, 'rules' ) );

for ( const test of tests ) {
	console.log( `Testing "${ test }"...` );

	require( `./rules/${ test }` );
}

console.log( 'OK!' );
