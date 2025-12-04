#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'node:fs';
import * as releaseTools from '@ckeditor/ckeditor5-dev-release-tools';
import { Listr } from 'listr2';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import { confirm } from '@inquirer/prompts';
import parseArguments from './utils/parsearguments.mjs';
import getListrOptions from './utils/getlistroptions.mjs';
import isMonoRepositoryDependency from './utils/ismonorepositorydependency.mjs';
import { PACKAGES_DIRECTORY, RELEASE_DIRECTORY } from './utils/constants.mjs';

const cliArguments = parseArguments( process.argv.slice( 2 ) );
const latestVersion = releaseTools.getLastFromChangelog();
const versionChangelog = releaseTools.getChangesForVersion( latestVersion );

const tasks = new Listr( [
	{
		title: 'Verifying the repository.',
		task: async () => {
			const errors = await releaseTools.validateRepositoryToRelease( {
				version: latestVersion,
				changes: versionChangelog,
				branch: cliArguments.branch
			} );

			if ( !errors.length ) {
				return;
			}

			return Promise.reject( 'Aborted due to errors.\n' + errors.map( message => `* ${ message }` ).join( '\n' ) );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Check the release directory.',
		task: async ( ctx, task ) => {
			const isAvailable = fs.existsSync( RELEASE_DIRECTORY );

			if ( !isAvailable ) {
				return fs.mkdirSync( RELEASE_DIRECTORY, { recursive: true } );
			}

			const isEmpty = fs.readdirSync( RELEASE_DIRECTORY ).length === 0;

			if ( isEmpty ) {
				return Promise.resolve();
			}

			// Do not ask when running on CI.
			if ( cliArguments.ci ) {
				return fs.rmSync( RELEASE_DIRECTORY, { recursive: true, force: true } );
			}

			const shouldContinue = await task.prompt( ListrInquirerPromptAdapter )
				.run( confirm, {
					message: 'The release directory must be empty. Continue and remove all files?'
				} );

			if ( !shouldContinue ) {
				return Promise.reject( 'Aborting as requested.' );
			}

			return fs.rmSync( RELEASE_DIRECTORY, { recursive: true, force: true } );
		}
	},
	{
		title: 'Updating the `#version` field.',
		task: () => {
			return releaseTools.updateVersions( {
				packagesDirectory: PACKAGES_DIRECTORY,
				version: latestVersion
			} );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Updating dependencies.',
		task: () => {
			return releaseTools.updateDependencies( {
				version: '^' + latestVersion,
				packagesDirectory: PACKAGES_DIRECTORY,
				shouldUpdateVersionCallback: isMonoRepositoryDependency
			} );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Copying linters-config packages.',
		task: () => {
			return releaseTools.prepareRepository( {
				outputDirectory: RELEASE_DIRECTORY,
				packagesDirectory: PACKAGES_DIRECTORY,
				packagesToCopy: cliArguments.packages
			} );
		}
	},
	{
		title: 'Cleaning-up.',
		task: () => {
			return releaseTools.cleanUpPackages( {
				packagesDirectory: RELEASE_DIRECTORY
			} );
		}
	},
	{
		title: 'Verify release directory.',
		task: async () => {
			const isEmpty = ( await fs.readdir( RELEASE_DIRECTORY ) ).length === 0;

			if ( !isEmpty ) {
				return;
			}

			return Promise.reject( 'Release directory is empty, aborting.' );
		}
	},
	{
		title: 'Commit & tag.',
		task: () => {
			return releaseTools.commitAndTag( {
				version: latestVersion,
				files: [
					'package.json',
					`${ PACKAGES_DIRECTORY }/*/package.json`
				]
			} );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	}
], getListrOptions( cliArguments ) );

tasks.run()
	.catch( err => {
		process.exitCode = 1;

		console.log( '' );
		console.error( err );
	} );
