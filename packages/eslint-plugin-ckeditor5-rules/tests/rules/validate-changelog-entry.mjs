/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import rule from '../../lib/rules/validate-changelog-entry.js';
import dedent from 'dedent';
import { RuleTester } from 'eslint';
import markdown from '@eslint/markdown';

const ruleTester = new RuleTester( {
	plugins: {
		markdown
	},
	language: 'markdown/gfm',
	languageOptions: {
		frontmatter: 'yaml'
	}
} );

ruleTester.run( 'eslint-plugin-ckeditor5-rules/validate-changelog-entry', rule, {
	valid: [
		// Single repository with only the "type" field.
		{
			code: dedent`
			---
			type: feature
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},

		// Mono repository with only the "type" field.
		{
			code: dedent`
			---
			type: feature
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		// Uses "type: fix".
		{
			code: dedent`
			---
			type: fix
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},
		{
			code: dedent`
			---
			type: fix
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		// Uses "type: other".
		{
			code: dedent`
			---
			type: other
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},
		{
			code: dedent`
			---
			type: other
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		// Uses "type: breaking change" in single repository.
		{
			code: dedent`
			---
			type: breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},

		// Uses "type: major breaking change" in mono repository.
		{
			code: dedent`
			---
			type: major breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		// Uses "type: minor breaking change" in mono repository.
		{
			code: dedent`
			---
			type: minor breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		// Uses allowed "scope" field.
		{
			code: dedent`
			---
			type: feature
			scope:
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono', allowedScopes: [ 'test' ] } ]
		},
		{
			code: dedent`
			---
			type: feature
			scope:
			 -
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono', allowedScopes: [ 'test' ] } ]
		},
		{
			code: dedent`
			---
			type: feature
			scope: test
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono', allowedScopes: [ 'test' ] } ]
		},
		{
			code: dedent`
			---
			type: feature
			scope:
			 - test
			 - test2
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono', allowedScopes: [ 'test', 'test2' ] } ]
		},

		// Uses valid "closes" field.
		{
			code: dedent`
			---
			type: feature
			closes:
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			closes:
			 -
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			closes: 123
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			closes:
			 - 123
			 - ckeditor/ckeditor5#123
			 - https://github.com/ckeditor/ckeditor5/issues/18777
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		// Uses valid "see" field.
		{
			code: dedent`
			---
			type: feature
			see:
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			see:
			 -
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			see: 123
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			see:
			 - 123
			 - ckeditor/ckeditor5#123
			 - https://github.com/ckeditor/ckeditor5/issues/18777
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		// Uses valid "communityCredits" field.
		{
			code: dedent`
			---
			type: feature
			communityCredits:
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			communityCredits:
			 -
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			communityCredits: user
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},
		{
			code: dedent`
			---
			type: feature
			communityCredits:
			 - user1
			 - user2
			 - user3
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		}
	],

	invalid: [
		// Empty file.
		{
			code: dedent``,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Changelog entry must include a YAML frontmatter.',
				'Changelog entry must include a text summary.'
			]
		},

		// Missing frontmatter.
		{
			code: dedent`Changelog summary`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Changelog entry must include a YAML frontmatter.'
			]
		},

		// Empty frontmatter.
		{
			code: dedent`
			---
			---
			Changelog summary
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Changelog entry must include a \'type\' field.'
			]
		},

		// Missing text summary.
		{
			code: dedent`
			---
			type: feature
			---
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Changelog entry must include a text summary.'
			]
		},

		// Default text summary.
		{
			code: dedent`
			---
			type: feature
			---

			Required concise and meaningful summary of the change.

			Optional additional context or rationale. **Remove if not needed.**
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Replace the default placeholder text with a meaningful summary.',
				'Replace the default placeholder text with a meaningful summary.',
				'Replace the default placeholder text with a meaningful summary.'
			]
		},

		// Invalid "type" field.
		{
			code: dedent`
			---
			type: test
			---
			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Invalid \'type\' value: \'test\'.'
			]
		},

		// Uses "type: breaking change" in mono repository.
		{
			code: dedent`
			---
			type: breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Invalid \'type\' value: \'breaking change\'.'
			]
		},

		// Uses "type: major breaking change" in single repository.
		{
			code: dedent`
			---
			type: major breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ],
			errors: [
				'Invalid \'type\' value: \'major breaking change\'.'
			]
		},

		// Uses "type: minor breaking change" in single repository.
		{
			code: dedent`
			---
			type: minor breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ],
			errors: [
				'Invalid \'type\' value: \'minor breaking change\'.'
			]
		},

		// Scope in single repository.
		{
			code: dedent`
			---
			type: feature
			scope: test
			---
			Change summary.
			`,
			options: [ { repositoryType: 'single' } ],
			errors: [
				'Changelog entry for a single repository must not include the \'scopes\' field.'
			]
		},

		// Invalid "scope" field.
		{
			code: dedent`
			---
			type: feature
			scope: test
			---
			Change summary.
			`,
			options: [ { repositoryType: 'mono', allowedScopes: [ 'allowed' ] } ],
			errors: [
				'Invalid \'scope\' value: \'test\'.'
			]
		},

		// Invalid "closes" field.
		{
			code: dedent`
			---
			type: feature
			closes: test
			---
			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Invalid \'closes\' value: \'test\'.'
			]
		},

		// Invalid "see" field.
		{
			code: dedent`
			---
			type: feature
			see: test
			---
			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Invalid \'see\' value: \'test\'.'
			]
		},

		// Invalid "communityCredits" field.
		{
			code: dedent`
			---
			type: feature
			communityCredits: %^&*
			---
			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Invalid \'communityCredits\' value: \'%^&*\'.'
			]
		},

		// Invalid indent using tabs.
		{
			code: dedent`
			---
			type: feature
			scope:
				- test
				- test2
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono', allowedScopes: [ 'test', 'test2' ] } ],
			errors: [
				'Indentation should use spaces instead of tabs.',
				'Indentation should use spaces instead of tabs.'
			]
		}
	]
} );
