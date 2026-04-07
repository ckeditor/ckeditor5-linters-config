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

ruleTester.run( 'validate-module-tag', require( '../../lib/rules/validate-module-tag' ), {
	valid: [
		{
			code: `
			/**
			 * @module feature/featureediting
			 */
			export class FeatureEditing {}`,
			filename: '/repo/packages/ckeditor5-feature/src/featureediting.ts'
		},
		{
			code: `
			/**
			 * @module feature
			 */
			export * from './feature.js';`,
			filename: '/repo/packages/ckeditor5-feature/src/index.ts'
		},
		{
			code: `
			/**
			 * @module feature/index
			 */
			export * from './feature.js';`,
			filename: '/repo/packages/ckeditor5-feature/src/index.ts'
		},
		{
			code: `
			/**
			 * @module feature/ui/buttonview
			 */
			export class ButtonView {}`,
			filename: 'C:\\repo\\packages\\ckeditor5-feature\\src\\ui\\buttonview.ts'
		},
		{
			code: 'declare module "@ckeditor/ckeditor5-core" {}',
			filename: '/repo/packages/ckeditor5-feature/src/augmentation.ts'
		},
		{
			code: 'export class Helper {}',
			filename: '/repo/scripts/helper.ts'
		}
	],
	invalid: [
		{
			code: 'export class FeatureEditing {}',
			filename: '/repo/packages/ckeditor5-feature/src/featureediting.ts',
			errors: [
				{
					message: [
						'Missing file-level `@module feature/featureediting` JSDoc tag.',
						'The `@module` annotation should be placed at the top of the file.'
					].join( ' ' )
				}
			]
		},
		{
			code: `
			/**
			 * @module feature/featureui
			 */
			export class FeatureEditing {}`,
			filename: '/repo/packages/ckeditor5-feature/src/featureediting.ts',
			errors: [
				{
					message: 'Expected file-level `@module feature/featureediting` JSDoc tag, but found `@module feature/featureui`.'
				}
			]
		},
		{
			code: `
			/**
			 * @module wrong
			 */
			export * from './feature.js';`,
			filename: '/repo/packages/ckeditor5-feature/src/index.ts',
			errors: [
				{
					message: 'Expected file-level `@module feature` or `@module feature/index` JSDoc tag, but found `@module wrong`.'
				}
			]
		},
		{
			code: `
			/**
			 * @module
			 */
			export class FeatureEditing {}`,
			filename: '/repo/packages/ckeditor5-feature/src/featureediting.ts',
			errors: [
				{
					message: 'Expected file-level `@module feature/featureediting` JSDoc tag, but found `@module`.'
				}
			]
		}
	]
} );
