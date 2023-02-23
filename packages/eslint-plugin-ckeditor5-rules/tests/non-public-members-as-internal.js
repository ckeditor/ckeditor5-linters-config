/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

const markPrivateAsInternal = { message: 'Non-public identifiers must be marked as `@internal`.' };

ruleTester.run(
	'eslint-plugin-ckeditor5-rules/non-public-members-as-internal',
	require( '../lib/rules/non-public-members-as-internal' ),
	{
		invalid: [
			{
				code: `
				/**
				 * This is a test private property that is missing an internal tag.
				 */
				function _testFunc() {}`,
				output: `
				/**
				 * This is a test private property that is missing an internal tag.
				 *
				 * @internal
				 */
				function _testFunc() {}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				/**
				 * This is a test private property that is missing an internal tag.
				 */
				export function _testFunc() {}`,
				output: `
				/**
				 * This is a test private property that is missing an internal tag.
				 *
				 * @internal
				 */
				export function _testFunc() {}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 */
					public _bodyPlaceholder;
				}`,
				output: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					public _bodyPlaceholder;
				}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 */
					private bodyPlaceholder;
				}`,
				output: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					private bodyPlaceholder;
				}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @param testParam this is a test parameter that should be under @internal tag.
					 */
					private bodyPlaceholder;
				}`,
				output: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 * @param testParam this is a test parameter that should be under @internal tag.
					 */
					private bodyPlaceholder;
				}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 */
					protected bodyPlaceholder;
				}`,
				output: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					protected bodyPlaceholder;
				}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 */
					private static bodyPlaceholder;
				}`,
				output: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					private static bodyPlaceholder;
				}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 */
					declare private static readonly bodyPlaceholder;
				}`,
				output: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					declare private static readonly bodyPlaceholder;
				}`,
				errors: [ markPrivateAsInternal ]
			},
			{
				code: `
				function _testFunc() {}`,
				output: `
				/**
				 * @internal
				 */
				function _testFunc() {}`,
				errors: [ markPrivateAsInternal ]
			}
		],
		valid: [
			{
				code: `
				/**
				 * This is a test private property that is missing an internal tag.
				 *
				 * @internal
				 */
				function _testFunc() {}`
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					private _bodyPlaceholder;
				}`
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					public _bodyPlaceholder;
				}`
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					private bodyPlaceholder;
				}`
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 * @param testParam this is a test parameter that should be under @internal tag.
					 */
					private bodyPlaceholder;
				}`
			},
			{
				code: `
				class TestClass {
					/**
					 * This is a test private property that is missing an internal tag.
					 *
					 * @internal
					 */
					declare private static readonly bodyPlaceholder;
				}`
			}
		]
	}
);
