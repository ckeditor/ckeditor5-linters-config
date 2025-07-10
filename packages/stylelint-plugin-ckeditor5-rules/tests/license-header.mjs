/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import { getTestRule } from 'jest-preset-stylelint';
import licenseHeader from '../lib/license-header.mjs';

const { ruleName } = licenseHeader;

const testOptions = {
	plugins: [ licenseHeader ],
	ruleName,
	config: [
		true,
		{
			headerLines:
			[
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			]
		}
	]
};

const messages = {
	missingLicense: `This file does not begin with a license header. (${ ruleName })`,
	notLicense: `This file begins with a comment that is not a license header. (${ ruleName })`,
	incorrectContent: `Incorrect license header content. (${ ruleName })`,
	leadingSpacing: `Disallowed gap before the license. (${ ruleName })`,
	trailingSpacing: `Missing empty line after the license. (${ ruleName })`
};

getTestRule()( {
	...testOptions,

	accept: [
		{
			description: 'File containing only the license, without trailing empty line.',
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */'
			].join( '\n' )
		},
		{
			description: 'File containing only the license, with trailing empty line.',
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				''
			].join( '\n' )
		},
		{
			description: 'File containing the license and a CSS rule.',
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		}
	],

	reject: [
		{
			description: 'Reports error for empty file.',
			message: messages.missingLicense,
			code: ''
		},
		{
			description: 'Reports error for file without comments.',
			message: messages.missingLicense,
			code: [
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for file starting with comment that is not a license.',
			message: messages.notLicense,
			code: [
				'/* Comment */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with extra space at the beginning.',
			message: messages.incorrectContent,
			code: [
				'/* ',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with missing space at the beginning.',
			message: messages.incorrectContent,
			code: [
				'/*',
				'* Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with extra space at the end.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'  */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with missing space at the end.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'*/',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with extra part of the content.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' * This license has too much text.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license with missing part of the content.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license that does not start at the first line of the file.',
			message: messages.leadingSpacing,
			code: [
				'',
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Reports error for license that is not followed by an empty line.',
			message: messages.trailingSpacing,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		}
	]
} );

getTestRule()( {
	...testOptions,
	fix: true,

	reject: [
		{
			description: 'Fixes license with extra space at the beginning.',
			message: messages.incorrectContent,
			code: [
				'/* ',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Fixes license with missing space at the beginning.',
			message: messages.incorrectContent,
			code: [
				'/*',
				'* Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Fixes license with extra space at the end.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'  */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Fixes license with missing space at the end.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				'*/',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Fixes license with extra part of the content.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' * This license has too much text.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Fixes license with missing part of the content.',
			message: messages.incorrectContent,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Fixes license that does not start at the first line of the file.',
			message: messages.leadingSpacing,
			code: [
				'',
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		},
		{
			description: 'Fixes license that is not followed by an empty line.',
			message: messages.trailingSpacing,
			code: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' ),
			fixed: [
				'/*',
				' * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
				' */',
				'',
				'.ck.ck-editor {',
				'	margin: 1.5em 0;',
				'}',
				''
			].join( '\n' )
		}
	]
} );
