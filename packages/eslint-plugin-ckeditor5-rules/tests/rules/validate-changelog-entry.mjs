/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
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
		{
			name: 'Single repository with only the "type" field',
			code: dedent`
			---
			type: feature
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},

		{
			name: 'Mono repository with only the "type" field',
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
			name: 'Uses "type: fix" in single repository',
			code: dedent`
			---
			type: fix
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},
		{
			name: 'Uses "type: fix" in mono repository',
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
			name: 'Uses "type: other" in single repository',
			code: dedent`
			---
			type: other
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},
		{
			name: 'Uses "type: other" in mono repository',
			code: dedent`
			---
			type: other
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		{
			name: 'Uses "type: breaking change" in single repository',
			code: dedent`
			---
			type: breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'single' } ]
		},

		{
			name: 'Uses "type: major breaking change" in mono repository',
			code: dedent`
			---
			type: major breaking change
			---

			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ]
		},

		{
			name: 'Uses "type: minor breaking change" in mono repository',
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
			name: 'Empty "scope" field',
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
			name: '"scope" list with an empty item',
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
			name: '"scope" with a single allowed value',
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
			name: '"scope" with a list of allowed values',
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
			name: 'Empty "closes" field',
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
			name: '"closes" list with an empty item',
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
			name: '"closes" with a single issue number',
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
			name: '"closes" with a list of issue references',
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
			name: 'Empty "see" field',
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
			name: '"see" list with an empty item',
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
			name: '"see" with a single issue number',
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
			name: '"see" with a list of issue references',
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
			name: 'Empty "communityCredits" field',
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
			name: '"communityCredits" list with an empty item',
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
			name: '"communityCredits" with a single user',
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
			name: '"communityCredits" with a list of users',
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
		{
			name: 'Empty file',
			code: dedent``,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Changelog entry must include a YAML frontmatter.',
				'Changelog entry must include a text summary.'
			]
		},

		{
			name: 'Missing frontmatter',
			code: dedent`Changelog summary`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Changelog entry must include a YAML frontmatter.'
			]
		},

		{
			name: 'Empty frontmatter',
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

		{
			name: 'Missing text summary',
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

		{
			name: 'Default text summary',
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

		{
			name: 'Invalid "type" field',
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

		{
			name: 'Uses "type: breaking change" in mono repository',
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

		{
			name: 'Uses "type: major breaking change" in single repository',
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

		{
			name: 'Uses "type: minor breaking change" in single repository',
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

		{
			name: 'Scope in single repository',
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

		{
			name: 'Invalid "scope" field',
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

		{
			name: 'Invalid "closes" field',
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

		{
			name: 'Invalid "see" field',
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

		{
			name: 'Invalid "communityCredits" field',
			code: dedent`
			---
			type: feature
			communityCredits: %^&*
			---
			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'Invalid \'communityCredits\' value: \'%^&*\'.',
				'YAML syntax error: Plain value cannot start with directive indicator character %.'
			]
		},

		{
			name: 'Invalid indent using tabs',
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
				'YAML syntax error: Tabs are not allowed as indentation.',
				'YAML syntax error: Tabs are not allowed as indentation.'
			]
		},

		{
			name: 'Invalid indent',
			code: dedent`
			---
			type: fix
			closes:
			8675
			---
			Change summary.
			`,
			options: [ { repositoryType: 'mono' } ],
			errors: [
				'YAML syntax error: Implicit map keys need to be followed by map values.'
			]
		}
	]
} );
