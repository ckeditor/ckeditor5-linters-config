/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

const primaryOption = {};
const secondaryOptionObject = {
	headerContent: [
		' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
		' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license'
	]
};
const context = {};

describe( 'license-header', () => {
	let stubs, ruleFunction, lintFunction;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			stylelint: {
				createPlugin: sinon.stub(),
				utils: {
					report: sinon.stub(),
					ruleMessages: sinon.stub()
				}
			}
		};

		mockery.registerMock( 'stylelint', stubs.stylelint );

		require( '../../lib/rules/license-header' );

		console.log( stubs.stylelint.createPlugin.toString() );

		ruleFunction = stubs.stylelint.createPlugin.firstCall.args[ 1 ];

		lintFunction = ruleFunction( primaryOption, secondaryOptionObject, context );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.deregisterAll();
	} );

	it( 'returns linting function for the rule', () => {
		expect( lintFunction ).to.be.a( 'function' );
	} );

	describe( 'lint()', () => {
		it( 'reports error when first node is not a comment', () => {
			const root = { nodes: [
				{
					type: 'declaration',
					text: 'foo',
					raws: {
						left: '',
						right: ''
					}
				}
			] };
			const result = {};

			const returnValue = lintFunction( root, result );

			console.log( returnValue );
		} );
	} );
} );
