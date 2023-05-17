/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const importError = { message: 'Import that extends a CKEditor 5 build is not allowed.' };

const ruleTester = new RuleTester( { parserOptions: { sourceType: 'module', ecmaVersion: 2018 } } );
ruleTester.run( 'eslint-plugin-ckeditor5-rules/no-build-extensions', require( '../../lib/rules/no-build-extensions' ), {
	valid: [
		// Importing an editor build.
		'import ClassicEditor from \'@ckeditor/ckeditor5-build-classic\';',
		// Importing a multi-word editor build.
		'import MultiRootEditor from \'@ckeditor/ckeditor5-build-multi-root\';',
		// Importing an editor class.
		'import { ClassicEditor } from \'@ckeditor/ckeditor5-editor-classic\';',
		// Importing a multi-word editor class.
		'import { MultiRootEditor } from \'@ckeditor/ckeditor5-editor-multi-root\';',
		// Importing an editor class from the "src" directory.
		'import { MultiRootEditor } from \'@ckeditor/ckeditor5-editor-multi-root/src\';',
		// Importing an editor class from the "src" directory (with slash at path end).
		'import { MultiRootEditor } from \'@ckeditor/ckeditor5-editor-multi-root/src/\';'
	],
	invalid: [
		{
			code: 'import { ClassicEditor } from \'@ckeditor/ckeditor5-build-classic/src\';',
			errors: [ importError ]
		},
		{
			code: 'import { ClassicEditor } from \'@ckeditor/ckeditor5-build-classic/src/\';',
			errors: [ importError ]
		},
		{
			code: 'import ClassicEditor from \'@ckeditor/ckeditor5-build-classic/src/ckeditor\';',
			errors: [ importError ]
		},
		{
			code: 'import { MultiRootEditor } from \'@ckeditor/ckeditor5-build-multi-root/src\';',
			errors: [ importError ]
		},
		{
			code: 'import { MultiRootEditor } from \'@ckeditor/ckeditor5-build-multi-root/src/\';',
			errors: [ importError ]
		},
		{
			code: 'import MultiRootEditor from \'@ckeditor/ckeditor5-build-multi-root/src/ckeditor\';',
			errors: [ importError ]
		}
	]
} );
