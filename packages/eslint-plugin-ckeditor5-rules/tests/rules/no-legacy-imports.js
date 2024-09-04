/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const rule = require( '../../lib/rules/no-legacy-imports' );
const fs = require( 'fs-extra' );
const upath = require( 'upath' );

function mockPackageJson( config ) {
	const packagesToRemove = [];

	for ( const [ location, content ] of Object.entries( config ) ) {
		const pkgJsonPath = upath.join( 'node_modules', location );

		if ( fs.pathExistsSync( pkgJsonPath ) ) {
			console.warn( `Cannot mock the "${ location }" file as it already exists.` );
			continue;
		}

		fs.ensureFileSync( pkgJsonPath );
		fs.writeFileSync( pkgJsonPath, content );
		packagesToRemove.push( pkgJsonPath );
	}

	return () => {
		for ( const item of packagesToRemove ) {
			fs.removeSync( upath.join( 'node_modules', item.split( '/' )[ 0 ] ) );
		}
	};
}

// Create fake `package.json` files to avoid installing real dependencies.
const removeMock = mockPackageJson( {
	'ckeditor5/package.json': JSON.stringify( {
		dependencies: {
			'@ckeditor/ckeditor5-core': '*'
		}
	} ),
	'ckeditor5-premium-features/package.json': JSON.stringify( {
		dependencies: {
			'@ckeditor/ckeditor5-ai': '*'
		}
	} )
} );

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'no-legacy-imports', rule, {
	valid: [

		// Default options - fix all CKEditor5 imports.
		{
			code: 'import Something from "ckeditor5";'
		},
		{
			code: 'import Something from "ckeditor5-premium-features";'
		},

		// Only fix 'ckeditor5' imports.
		{
			code: 'import Something from "ckeditor5";',
			options: [ { packages: [ 'ckeditor5' ] } ]
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-ai";',
			options: [ { packages: [ 'ckeditor5' ] } ]
		},

		// Only fix 'ckeditor5-premium-features' imports.
		{
			code: 'import Something from "@ckeditor/ckeditor5-core";',
			options: [ { packages: [ 'ckeditor5-premium-features' ] } ]
		},
		{
			code: 'import Something from "ckeditor5-premium-features";',
			options: [ { packages: [ 'ckeditor5-premium-features' ] } ]
		},

		// Imports containing `/src/` are valid, as they are reported as errors by other rules.
		{
			code: 'import Something from "@ckeditor/ckeditor5-core/src/index";'
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-ai/src/index";'
		}
	],
	invalid: [

		// ckeditor5
		{
			code: 'import Something from "ckeditor5/src/core";',
			output: 'import Something from "ckeditor5";',
			errors: [
				'Import must be done from the "ckeditor5" package'
			]
		},

		{
			code: 'import Something from "ckeditor5/src/core.js";',
			output: 'import Something from "ckeditor5";',
			errors: [
				'Import must be done from the "ckeditor5" package'
			]
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-core";',
			output: 'import Something from "ckeditor5";',
			errors: [
				'Import must be done from the "ckeditor5" package'
			]
		},

		// ckeditor5-premium-features
		{
			code: 'import Something from "ckeditor5-collaboration/src/collaboration-core";',
			output: 'import Something from "ckeditor5-premium-features";',
			errors: [
				'Import must be done from the "ckeditor5-premium-features" package'
			]
		},
		{
			code: 'import Something from "ckeditor5-collaboration/src/collaboration-core.js";',
			output: 'import Something from "ckeditor5-premium-features";',
			errors: [
				'Import must be done from the "ckeditor5-premium-features" package'
			]
		},
		{
			code: 'import Something from "@ckeditor/ckeditor5-ai";',
			output: 'import Something from "ckeditor5-premium-features";',
			errors: [
				'Import must be done from the "ckeditor5-premium-features" package'
			]
		}
	]
} );

removeMock();
