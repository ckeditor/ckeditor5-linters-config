/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PACKAGES_DIRECTORY } from './constants.mjs';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const ROOT_DIRECTORY = path.join( __dirname, '..', '..' );
const PACKAGES_PATH = path.join( ROOT_DIRECTORY, PACKAGES_DIRECTORY );

// Name of available packages in the `packages/` directory.
const AVAILABLE_PACKAGES = fs.readdirSync( PACKAGES_PATH )
	.map( directoryName => {
		const packageJsonPath = path.join( PACKAGES_PATH, directoryName, 'package.json' );
		const packageJson = JSON.parse( fs.readFileSync( packageJsonPath, { encoding: 'utf-8' } ) );

		return packageJson.name;
	} );

/**
 * @param {String} packageName
 * @returns {Boolean}
 */
export default function isValidDependency( packageName ) {
	return AVAILABLE_PACKAGES.includes( packageName );
}
