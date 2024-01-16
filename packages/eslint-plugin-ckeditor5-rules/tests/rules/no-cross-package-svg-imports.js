/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'no-cross-package-svg-imports', require( '../../lib/rules/no-cross-package-svg-imports' ), {
	valid: [
		{
			code: 'import Something from "../theme/icons/icon.svg";'
		},
		{
			code: 'import Something from "../../theme/icons/icon.svg";'
		}
	],
	invalid: [
		{
			code: 'import Something from "OTHER_PACKAGE/theme/icons/icon.svg";',
			errors: [
				'Icons can only be imported from package\'s own `theme` folder or by importing it from other package main entrypoint.'
			]
		},
		{
			code: 'import Something from "../../../OTHER_PACKAGE/theme/icons/icon.svg";',
			errors: [
				'Icons can only be imported from package\'s own `theme` folder or by importing it from other package main entrypoint.'
			]
		},
		{
			code: 'import Something from "../../../../../nod_modules/OTHER_PACKAGE/theme/icons/icon.svg";',
			errors: [
				'Icons can only be imported from package\'s own `theme` folder or by importing it from other package main entrypoint.'
			]
		}
	]
} );
