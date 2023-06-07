/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const fs = require( 'fs' );
const path = require( 'path' );

const { PACKAGES_DIRECTORY } = require( './constants' );
const ROOT_DIRECTORY = path.join( __dirname, '..', '..' );
const PACKAGES_PATH = path.join( ROOT_DIRECTORY, PACKAGES_DIRECTORY );

// Name of available packages in the `packages/` directory.
const AVAILABLE_PACKAGES = fs.readdirSync( PACKAGES_PATH )
	.map( directoryName => {
		const packagePath = path.join( PACKAGES_PATH, directoryName );
		const packageJson = require( path.join( packagePath, 'package.json' ) );

		return packageJson.name;
	} );

/**
 * @param {String} packageName
 * @returns {Boolean}
 */
module.exports = function isValidDependency( packageName ) {
	return AVAILABLE_PACKAGES.includes( packageName );
};
