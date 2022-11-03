/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester();
const usingImportNotAllowed = { message: 'Using import with `@if CK_DEBUG_*` keyword is not allowed. Use `require()` instead.' };

ruleTester.run(
	'eslint-plugin-ckeditor5-rules/use-require-for-debug-mode-imports',
	require( '../lib/rules/use-require-for-debug-mode-imports' ),
	{
		invalid: [
			{
				code: '// @if CK_DEBUG // import defaultExport from \'module-name\';',
				output: '// @if CK_DEBUG // const defaultExport = require( \'module-name\' ).default;',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '// @if CK_DEBUG // import * as name from \'module-name\';',
				output: '// @if CK_DEBUG // const name = require( \'module-name\' );',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '// @if CK_DEBUG // import { testFunction } from \'module-name\';',
				output: '// @if CK_DEBUG // const { testFunction } = require( \'module-name\' );',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '// @if CK_DEBUG // import { testFunctionOne, testFunctionTwo } from \'module-name\';',
				output: '// @if CK_DEBUG // const { testFunctionOne, testFunctionTwo } = require( \'module-name\' );',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '// @if CK_DEBUG // import { default as alias } from \'module-name\';',
				output: '// @if CK_DEBUG // const alias = require( \'module-name\' ).default;',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '// @if CK_DEBUG // import { export1 as alias1 } from \'module-name\';',
				output: '// @if CK_DEBUG // const { export1: alias1 } = require( \'module-name\' );',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '// @if CK_DEBUG // import \'module-name\';',
				output: '// @if CK_DEBUG // require( \'module-name\' );',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '/**\n' +
				'* @if CK_DEBUG // import defaultExport from \'module-name\';\n' +
				'*/',
				output: '/**\n' +
				'* @if CK_DEBUG // const defaultExport = require( \'module-name\' ).default;\n' +
				'*/',
				errors: [ usingImportNotAllowed ]
			},
			{
				code: '/**\n' +
				'* @if CK_DEBUG // import defaultExport from \'module-name\';\n' +
				'* @if CK_DEBUG_FOO // import otherDefaultExport from \'other-module-name\';\n' +
				'*/',
				output: '/**\n' +
				'* @if CK_DEBUG // const defaultExport = require( \'module-name\' ).default;\n' +
				'* @if CK_DEBUG_FOO // const otherDefaultExport = require( \'other-module-name\' ).default;\n' +
				'*/',
				errors: [ usingImportNotAllowed ]
			}
		],
		valid: [
			{
				code: '// @if CK_DEBUG // const testModule = require( \'module-name\' );'
			},
			{
				code: '// @if CK_DEBUG_MINIMAP // const testModule = require( \'module-name\' );'
			},
			{
				code: '// @if CK_DEBUG_ENGINE // const testModule = require( \'module-name\' );'
			},
			{
				code: '// @if CK_DEBUG // const defaultExport = require( \'module-name\' ).default;'
			},
			{
				code: '// @if CK_DEBUG // const { testFunction } = require( \'module-name\' );'
			},
			{
				code: '// @if CK_DEBUG // const alias = require( \'module-name\' ).default;'
			},
			{
				code: '// @if CK_DEBUG // const { export1: alias1 } = require( \'module-name\' );'
			},
			{
				code: '// @if CK_DEBUG // require( \'module-name\' );'
			},
			{
				code: '// @if CK_DEBUG 	// require( \'module-name\' );'
			},
			{
				code: '// @if CK_DEBUG //	require( \'module-name\' );'
			},
			{
				code: '/**\n' +
				'* @if CK_DEBUG // const testModule = require( \'module-name\' );\n' +
				'*/'
			},
			{
				code: '/**\n' +
				'* @if CK_DEBUG // const testModule = require( \'module-name\' );\n' +
				'* @if CK_DEBUG_FOO // const testOtherModule = require( \'other-module-name\' );\n' +
				'*/'
			}
		]
	}
);
