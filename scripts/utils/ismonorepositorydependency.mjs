/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PACKAGES_DIRECTORY } from './constants.mjs';

const ROOT_DIRECTORY = path.join( import.meta.dirname, '..', '..' );
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
