#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { generateChangelogForMonoRepository } from '@ckeditor/ckeditor5-dev-changelog';
import { ROOT_DIRECTORY, PACKAGES_DIRECTORY } from './utils/constants.mjs';
import parseArguments from './utils/parsearguments.mjs';

const cliOptions = parseArguments( process.argv.slice( 2 ) );

const changelogOptions = {
	cwd: ROOT_DIRECTORY,
	packagesDirectory: PACKAGES_DIRECTORY,
	disableFilesystemOperations: cliOptions.dryRun,
	shouldIgnoreRootPackage: true,
	npmPackageToCheck: 'eslint-config-ckeditor5',
	transformScope: name => {
		return {
			displayName: name,
			npmUrl: 'https://www.npmjs.com/package/' + name
		};
	}
};

if ( cliOptions.date ) {
	changelogOptions.date = cliOptions.date;
}

generateChangelogForMonoRepository( changelogOptions )
	.then( maybeChangelog => {
		if ( maybeChangelog ) {
			console.log( maybeChangelog );
		}
	} );
