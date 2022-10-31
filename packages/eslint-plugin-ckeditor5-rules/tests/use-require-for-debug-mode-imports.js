/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester();
const usingImportNotAllowed = { message: 'Using import with "@if CK_DEBUG" keyword is not allowed. Please Use require().' };

ruleTester.run(
	'eslint-plugin-ckeditor5-rules/use-require-for-debug-mode-imports',
	require( '../lib/rules/use-require-for-debug-mode-imports' ),
	{
		invalid: [
			{
				code: '// @if CK_DEBUG // import TestPackage from \'test-package\';',
				output: '// @if CK_DEBUG // const TestPackage = require(\'test-package\');',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '// @if CK_DEBUG // import { testFunction } from \'test-package\';',
				output: '// @if CK_DEBUG // const { testFunction } = require(\'test-package\');',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '/**\n' +
				'* @if CK_DEBUG // import TestPackage from \'test-package\';\n' +
				'*/',
				output: '/**\n' +
				'* @if CK_DEBUG // const TestPackage = require(\'test-package\');\n' +
				'*/',
				errors: [ usingImportNotAllowed ] }
		],
		valid: [
			{
				code: '// @if CK_DEBUG // const TestPackage = require(\'test-package\');'
			},
			{
				code: '// @if CK_DEBUG // const { testFunction } = require(\'test-package\');'
			},
			{
				code: '/**\n' +
				'* @if CK_DEBUG // const TestPackage = require(\'test-package\');\n' +
				'*/'
			}
		]
	}
);
