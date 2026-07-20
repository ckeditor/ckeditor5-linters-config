/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const parser = require( '@typescript-eslint/parser' );

const ruleTester = new RuleTester( {
	languageOptions: {
		parser
	}
} );

const markPrivateAsInternal = { message: 'Non-public identifiers must be marked as `@internal`.' };

ruleTester.run(
	'eslint-plugin-ckeditor5-rules/non-public-members-as-internal',
	require( '../../lib/rules/non-public-members-as-internal' ),
	{
		invalid: [
			{
				name: 'Adds @internal to the JSDoc of an underscore-prefixed function',
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
				name: 'Adds @internal to the JSDoc of an exported underscore-prefixed function',
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
				name: 'Adds @internal to a public class property with an underscore-prefixed name',
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
				name: 'Adds @internal to a private class property',
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
				name: 'Adds @internal before the @param tag in the JSDoc of a private property',
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
				name: 'Adds @internal to a protected class property',
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
				name: 'Adds @internal to a private static class property',
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
				name: 'Adds @internal to a declared private static readonly class property',
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
				name: 'Creates a JSDoc block with @internal for an undocumented underscore-prefixed function',
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
				name: 'Underscore-prefixed function already marked as @internal',
				code: `
				/**
				 * This is a test private property that is missing an internal tag.
				 *
				 * @internal
				 */
				function _testFunc() {}`
			},
			{
				name: 'Private underscore-prefixed property marked as @internal',
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
				name: 'Public underscore-prefixed property marked as @internal',
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
				name: 'Private property marked as @internal',
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
				name: 'Private property with @internal followed by a @param tag',
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
				name: 'Declared private static readonly property marked as @internal',
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
