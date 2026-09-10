/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, expect, it } from 'vitest';
import { Linter } from 'eslint';
import config from '../eslint.config.mjs';

const linter = new Linter();

function lint( lines, filePath = 'file.js' ) {
	return linter.verify( lines.join( '\n' ), config, filePath );
}

/**
 * `no-var` represents the whole rule set. If ESLint reports it, the preset matched the file.
 */
function getRuleIds( filePath ) {
	return lint( [ 'var foo = 1;', '' ], filePath ).map( ( { ruleId } ) => ruleId );
}

/**
 * A parsing error is fatal. The parser reports the error alone and no rule runs. The reported
 * position matches the lines of the snippet, thus it shows the line that stopped the parser.
 */
function getParsingErrors( lines ) {
	return lint( lines )
		.filter( ( { fatal } ) => fatal )
		.map( ( { line, column, message } ) => `${ line }:${ column } ${ message }` );
}

describe( 'eslint-config-ckeditor5', () => {
	// These tests guard the `files` pattern that carries the language settings. Without them, the
	// `ecmaVersion` cases below also pass on a preset that matches nothing, because ESLint parses no code.
	describe( 'files', () => {
		it( 'lints .js files', () => {
			expect( getRuleIds( 'file.js' ) ).toContain( 'no-var' );
		} );

		it( 'lints .cjs files', () => {
			expect( getRuleIds( 'file.cjs' ) ).toContain( 'no-var' );
		} );

		it( 'lints .mjs files', () => {
			expect( getRuleIds( 'file.mjs' ) ).toContain( 'no-var' );
		} );

		it( 'lints .ts files', () => {
			expect( getRuleIds( 'file.ts' ) ).toContain( 'no-var' );
		} );

		it( 'lints .tsx files', () => {
			expect( getRuleIds( 'file.tsx' ) ).toContain( 'no-var' );
		} );
	} );

	// These snippets use syntax that ES2020 does not include. Each snippet is a parsing error
	// under a lower `ecmaVersion`. The cases fail if the preset does not accept modern syntax.
	describe( 'ecmaVersion: 2023', () => {
		it( 'parses logical assignment operators', () => {
			const code = [
				'let foo = null;',
				'',
				'foo ??= 1;',
				'foo ||= 2;',
				'foo &&= 3;',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );

		it( 'parses numeric separators', () => {
			const code = [
				'const KILOBYTE = 1_000;',
				'const MEGABYTE = 1_000_000;',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );

		it( 'parses class fields', () => {
			const code = [
				'class Foo {',
				'\tstatic bar = 1;',
				'',
				'\tbaz = 2;',
				'}',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );

		it( 'parses private class members', () => {
			const code = [
				'class Foo {',
				'\t#bar = 1;',
				'',
				'\t#baz() {',
				'\t\treturn this.#bar;',
				'\t}',
				'}',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );

		it( 'parses private brand checks', () => {
			const code = [
				'class Foo {',
				'\t#bar = 1;',
				'',
				'\tstatic has( foo ) {',
				'\t\treturn #bar in foo;',
				'\t}',
				'}',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );

		it( 'parses static initialization blocks', () => {
			const code = [
				'class Foo {',
				'\tstatic bar;',
				'',
				'\tstatic {',
				'\t\tFoo.bar = 1;',
				'\t}',
				'}',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );

		it( 'parses top-level await', () => {
			const code = [
				'const foo = await Promise.resolve( 1 );',
				'',
				'console.log( foo );',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );

		it( 'parses regular expression match indices', () => {
			const code = [
				'const pattern = /foo/d;',
				'const { indices } = pattern.exec( \'foobar\' );',
				''
			];

			expect( getParsingErrors( code ) ).toEqual( [] );
		} );
	} );
} );
