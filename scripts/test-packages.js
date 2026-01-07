/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { execSync } = require( 'node:child_process' );
const path = require( 'node:path' );

const PACKAGES_TO_TEST = [
	'eslint-plugin-ckeditor5-rules',
	'stylelint-plugin-ckeditor5-rules'
];

const packagesPath = path.join( __dirname, '..', 'packages' );

const completed = [];
const failed = [];

for ( const packageName of PACKAGES_TO_TEST ) {
	console.log( `\n🔷 Starting tests for "${ packageName }".\n` );

	try {
		execSync( 'pnpm run test', {
			stdio: 'inherit',
			cwd: path.join( packagesPath, packageName )
		} );

		console.log( `\n✅ Tests for "${ packageName }" complete.\n` );

		completed.push( packageName );
	} catch {
		console.log( `\n❌ Tests for "${ packageName }" finished with an error.\n` );

		failed.push( packageName );
	}
}

console.log( '\n🔷 Summary of tests:' );

if ( completed.length ) {
	console.log( '\n✅ Completed:' );

	for ( const packageName of completed ) {
		console.log( ` - ${ packageName }` );
	}
}

if ( failed.length ) {
	console.log( '\n❌ Failed:' );

	for ( const packageName of failed ) {
		console.log( ` - ${ packageName }` );
	}
}

console.log( '' );

if ( failed.length ) {
	process.exit( 1 );
}
