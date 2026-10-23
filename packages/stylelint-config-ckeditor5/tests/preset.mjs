/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import path from 'node:path';
import stylelint from 'stylelint';
import { describe, expect, it } from '@jest/globals';

const presetPath = path.resolve( import.meta.dirname, '..', '.stylelintrc' );

// Rules from `@stylistic/stylelint-plugin` that parse selectors. The preset loads the plugin,
// so projects that extend it can enable them.
const selectorRules = {
	'@stylistic/selector-attribute-brackets-space-inside': 'never',
	'@stylistic/selector-attribute-operator-space-after': 'never',
	'@stylistic/selector-attribute-operator-space-before': 'never',
	'@stylistic/selector-combinator-space-after': 'always',
	'@stylistic/selector-combinator-space-before': 'always',
	'@stylistic/selector-descendant-combinator-no-non-space': true,
	'@stylistic/selector-list-comma-newline-after': 'always',
	'@stylistic/selector-list-comma-space-before': 'never',
	'@stylistic/selector-pseudo-class-case': 'lower',
	'@stylistic/selector-pseudo-class-parentheses-space-inside': 'never',
	'@stylistic/selector-pseudo-element-case': 'lower',
	'@stylistic/string-quotes': 'double'
};

const code = [
	'.ck.ck-editor   >   .ck-toolbar,.ck-button:HOVER {',
	'  color: var(--ck-color-text);',
	'}',
	'a[ href = \'x\' ] ~ .ck-sibling+.ck-next , .ck-x :NOT( .ck-y ) {',
	'	content: "a";',
	'}',
	'.ck-a',
	'	.ck-b {',
	'	width: 1px;',
	'}',
	'.ck-c::BEFORE , .ck-d:nth-child( 2n + 1 ) {',
	'	margin: 0;',
	'}',
	''
].join( '\n' );

function lint( rules, fix = false ) {
	return stylelint.lint( {
		code,
		fix,
		config: {
			extends: [ presetPath ],
			rules
		}
	} );
}

function getReportedRules( result ) {
	return [ ...new Set( result.results[ 0 ].warnings.map( warning => warning.rule ) ) ].sort();
}

describe( 'stylelint-config-ckeditor5', () => {
	it( 'reports and fixes the indentation', async () => {
		const result = await lint( {} );
		const fixed = await lint( {}, true );

		expect( getReportedRules( result ) ).toEqual( [ '@stylistic/indentation' ] );
		expect( fixed.code ).toEqual( code.replace( '  color', '\tcolor' ).replace( '\t.ck-b', '.ck-b' ) );
	} );

	it( 'reports and fixes selectors with the selector rules of the stylistic plugin', async () => {
		const result = await lint( selectorRules );
		const fixed = await lint( selectorRules, true );

		expect( getReportedRules( result ) ).toEqual( [ '@stylistic/indentation', ...Object.keys( selectorRules ) ].sort() );
		expect( fixed.code ).toEqual( [
			'.ck.ck-editor > .ck-toolbar,',
			'.ck-button:hover {',
			'	color: var(--ck-color-text);',
			'}',
			'a[href="x"] ~ .ck-sibling + .ck-next,',
			'.ck-x :not(.ck-y) {',
			'	content: "a";',
			'}',
			'.ck-a .ck-b {',
			'	width: 1px;',
			'}',
			'.ck-c::before,',
			'.ck-d:nth-child(2n + 1) {',
			'	margin: 0;',
			'}',
			''
		].join( '\n' ) );
	} );
} );
