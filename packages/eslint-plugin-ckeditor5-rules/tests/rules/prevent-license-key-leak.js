/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'prevent-license-key-leak', require( '../../lib/rules/prevent-license-key-leak' ), {
	valid: [
		{ code: 'const test = {}' },
		{ code: 'const test = { unrelated: 123 }' },
		{ code: 'const test = { licenseKey: GLOBAL_VARIABLE }' },
		{ code: 'const test = { licenseKey: "<YOUR_LICENSE_KEY>" }' },
		{ code: 'const test = { licenseKey: "GPL" }' }
	],
	invalid: [
		{
			code: 'const test = { licenseKey: \'anything\' };',
			errors: [
				'This code contains a license key. Replace it with the "<YOUR_LICENSE_KEY>" string.'
			],
			output: 'const test = { licenseKey: \'<YOUR_LICENSE_KEY>\' };'
		},
		{
			code: 'const test = { licenseKey: "anything" };',
			errors: [
				'This code contains a license key. Replace it with the "<YOUR_LICENSE_KEY>" string.'
			],
			output: 'const test = { licenseKey: "<YOUR_LICENSE_KEY>" };'
		}
	]
} );
