/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'node:path' );
const { RuleTester } = require( 'eslint' );

const ruleTester = new RuleTester( {
	languageOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	}
} );

const allowlistOptions = [
	{
		allowedPackages: [ 'ckeditor5-engine', 'ckeditor5-core' ],
		allowedCalls: [ 'is' ]
	}
];

const featureFile = path.posix.join( '/', 'workspace', 'ckeditor5', 'packages', 'ckeditor5-paragraph', 'src', 'paragraph.js' );
const engineFile = path.posix.join( '/', 'workspace', 'ckeditor5', 'packages', 'ckeditor5-engine', 'src', 'model', 'schema.js' );
const coreFile = path.posix.join( '/', 'workspace', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'editor.js' );

ruleTester.run( 'eslint-plugin-ckeditor5-rules/no-literal-dollar-root', require( '../../lib/rules/no-literal-dollar-root' ), {
	valid: [
		// Allowlisted package — engine can define `$root`.
		{
			code: 'schema.register( \'$root\', { isRoot: true } );',
			filename: engineFile,
			options: allowlistOptions
		},
		// Allowlisted package — core can reference `$root`.
		{
			code: 'const ROOT = \'$root\';',
			filename: coreFile,
			options: allowlistOptions
		},
		// Other schema contexts must not be flagged.
		{
			code: 'editor.data.parse( html, \'$documentFragment\' );',
			filename: featureFile,
			options: allowlistOptions
		},
		{
			code: 'editor.data.parse( html, \'$clipboardHolder\' );',
			filename: featureFile,
			options: allowlistOptions
		},
		// Plain rootElement check, the recommended form.
		{
			code: 'if ( node.is( \'rootElement\' ) ) { /* … */ }',
			filename: featureFile,
			options: allowlistOptions
		},
		// Comments and JSDoc that mention `$root` must not be flagged (Literal handler ignores comments).
		{
			code:
				'// $root is the default root element name in the engine.\n' +
				'const name = \'paragraph\';\n',
			filename: featureFile,
			options: allowlistOptions
		},
		{
			code:
				'/**\n' +
				' * Returns true for "$root".\n' +
				' */\n' +
				'function isRoot() { return true; }\n',
			filename: featureFile,
			options: allowlistOptions
		},
		// Template literal containing `$root` is not a string Literal node, so it is allowed.
		{
			code: 'const t = `$root is the default`;',
			filename: featureFile,
			options: allowlistOptions
		},
		// `allowedCalls` opt-out: `$root` inside a `.is()` argument list (single arg) is allowed.
		// Note: the canonical bad form `.is('element', '$root')` is reported separately as `isElementDollarRoot`.
		{
			code: 'if ( node.is( \'$root\' ) ) {}',
			filename: featureFile,
			options: allowlistOptions
		},
		// Default options (empty allowlist) — engine code is still flagged, but bare valid usage of other strings is fine.
		{
			code: 'const t = \'paragraph\';',
			filename: featureFile
		},

		// `schema.extend( '$root', { allowAttributes: … } )` — the documented escape hatch for adding attributes to the default root.
		{
			code: 'editor.model.schema.extend( \'$root\', { allowAttributes: properties } );',
			filename: featureFile,
			options: allowlistOptions
		},
		// Bare `schema` receiver, same shape.
		{
			code: 'schema.extend( \'$root\', { allowAttributes: [ \'foo\', \'bar\' ] } );',
			filename: featureFile,
			options: allowlistOptions
		},
		// String-keyed `allowAttributes` is also accepted.
		{
			code: 'schema.extend( \'$root\', { \'allowAttributes\': properties } );',
			filename: featureFile,
			options: allowlistOptions
		},

		// View-event listener `context` option — `'$root'` here is a view-tree bubbling target, not a schema name.
		{
			code: 'this.listenTo( viewDocument, \'arrowKey\', handler, { context: \'$root\' } );',
			filename: featureFile,
			options: allowlistOptions
		},
		// `context` as an array of view-tree predicates including `'$root'`.
		{
			code: 'this.listenTo( viewDocument, \'arrowKey\', handler, { context: [ isWidget, \'$root\' ] } );',
			filename: featureFile,
			options: allowlistOptions
		},
		// String-keyed `'context'`.
		{
			code: 'this.listenTo( viewDocument, \'arrowKey\', handler, { \'context\': \'$root\' } );',
			filename: featureFile,
			options: allowlistOptions
		}
	],

	invalid: [
		// Pattern 1: `.is( 'element', '$root' )` is autofixed to `.is( 'rootElement' )`.
		{
			code: 'if ( node.is( \'element\', \'$root\' ) ) {}',
			output: 'if ( node.is( \'rootElement\' ) ) {}',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'isElementDollarRoot' } ]
		},
		// Same pattern with `this` receiver.
		{
			code: 'this.is( \'element\', \'$root\' );',
			output: 'this.is( \'rootElement\' );',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'isElementDollarRoot' } ]
		},
		// Same pattern with optional chain receiver.
		{
			code: 'node?.is( \'element\', \'$root\' );',
			output: 'node?.is( \'rootElement\' );',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'isElementDollarRoot' } ]
		},

		// Pattern 2: `x.name === '$root'` autofixed to `x.is( 'rootElement' )`.
		{
			code: 'if ( node.name === \'$root\' ) {}',
			output: 'if ( node.is( \'rootElement\' ) ) {}',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'nameEqualsDollarRoot' } ]
		},
		// Pattern 2 (flipped operand order).
		{
			code: 'if ( \'$root\' === node.name ) {}',
			output: 'if ( node.is( \'rootElement\' ) ) {}',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'nameEqualsDollarRoot' } ]
		},
		// Pattern 2 (negated).
		{
			code: 'if ( node.name !== \'$root\' ) {}',
			output: 'if ( !node.is( \'rootElement\' ) ) {}',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'nameEqualsDollarRoot' } ]
		},
		// Pattern 2 with deeper receiver.
		{
			code: 'if ( editor.model.document.getRoot().name === \'$root\' ) {}',
			output: 'if ( editor.model.document.getRoot().is( \'rootElement\' ) ) {}',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'nameEqualsDollarRoot' } ]
		},

		// Pattern 1 with a logical-expression receiver — autofix skipped to avoid dropping parens and
		// silently flipping `( a || b ).is( … )` into `a || b.is( … )`.
		{
			code: 'if ( ( a || b ).is( \'element\', \'$root\' ) ) {}',
			output: null,
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'isElementDollarRoot' } ]
		},
		// Pattern 1 with a conditional-expression receiver — autofix skipped for the same reason.
		{
			code: 'if ( ( cond ? x : y ).is( \'element\', \'$root\' ) ) {}',
			output: null,
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'isElementDollarRoot' } ]
		},
		// Pattern 2 with a logical-expression receiver — autofix skipped, but the message hint wraps the
		// suggestion in parens so the rewrite text is itself valid.
		{
			code: 'if ( ( a || b ).name === \'$root\' ) {}',
			output: null,
			filename: featureFile,
			options: allowlistOptions,
			errors: [ {
				messageId: 'nameEqualsDollarRoot',
				data: { replacement: '( a || b ).is( \'rootElement\' )' }
			} ]
		},
		// Pattern 2 (negated) with a conditional-expression receiver — autofix skipped, parens preserved in hint.
		{
			code: 'if ( ( cond ? x : y ).name !== \'$root\' ) {}',
			output: null,
			filename: featureFile,
			options: allowlistOptions,
			errors: [ {
				messageId: 'nameEqualsDollarRoot',
				data: { replacement: '!( cond ? x : y ).is( \'rootElement\' )' }
			} ]
		},

		// Bare `$root` literal in a feature package.
		{
			code: 'const ROOT = \'$root\';',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'literalDollarRoot' } ]
		},
		// `schema.extend( '$root', … )` with extra keys beyond `allowAttributes` — escape hatch does not apply.
		{
			code: 'schema.extend( \'$root\', { allowAttributes: \'foo\', allowIn: \'paragraph\' } );',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'literalDollarRoot' } ]
		},
		// `schema.extend( '$root', { allowChildren: … } )` — wrong key, still flagged.
		{
			code: 'schema.extend( \'$root\', { allowChildren: \'foo\' } );',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'literalDollarRoot' } ]
		},
		// `schema.extend( '$root', { ...spread } )` — spread disqualifies (cannot statically verify key).
		{
			code: 'schema.extend( \'$root\', { ...rules } );',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'literalDollarRoot' } ]
		},
		// `schema.extend( '$root', otherObj )` — non-object-literal second arg, still flagged.
		{
			code: 'schema.extend( \'$root\', otherRules );',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'literalDollarRoot' } ]
		},
		// `writer.addRoot( _, '$root' )` — covered by the literal check.
		{
			code: 'writer.addRoot( newRoot, \'$root\' );',
			filename: featureFile,
			options: allowlistOptions,
			errors: [ { messageId: 'literalDollarRoot' } ]
		},
		// Default options — engine file is flagged when `allowedPackages` is empty.
		{
			code: 'const ROOT = \'$root\';',
			filename: engineFile,
			errors: [ { messageId: 'literalDollarRoot' } ]
		}
	]
} );
