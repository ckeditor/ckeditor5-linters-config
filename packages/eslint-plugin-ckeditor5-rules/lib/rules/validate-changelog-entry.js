/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const yaml = require( 'yaml' );

const ALLOWED_TYPES = {
	single: [
		'feature',
		'fix',
		'other',
		'breaking change'
	],
	mono: [
		'feature',
		'fix',
		'other',
		'major breaking change',
		'minor breaking change'
	]
};

const placeholderTexts = [
	'Required concise and meaningful summary of the change.',
	'Optional additional context or rationale.',
	'Remove if not needed.'
];

const ISSUE_SLUG_PATTERN = /^[a-z0-9.-]+\/[a-z0-9.-]+#\d+$/;
const ISSUE_PATTERN = /^\d+$/;
const ISSUE_URL_PATTERN = /^https:\/\/github\.com\/[a-z0-9.-]+\/[a-z0-9.-]+\/issues\/\d+$/;
const NICK_NAME_PATTERN = /^(@?)[a-z0-9-_]+$/i;

module.exports = {
	meta: {
		type: 'problem',
		fixable: 'whitespace',
		docs: {
			description: 'Validate changelog entries.',
			category: 'CKEditor5',
			url: 'https://ckeditor.com/docs/ckeditor5/latest/framework/contributing/code-style.html#valid-changelog-entries'
		},
		schema: [
			{
				type: 'object',
				additionalProperties: false,
				properties: {
					allowedScopes: {
						type: 'array',
						items: {
							type: 'string'
						}
					},

					repositoryType: {
						type: 'string',
						enum: [ 'single', 'mono' ]
					}
				},
				required: [ 'repositoryType' ]
			}
		],
		messages: {
			'missingChangeData': 'Changelog entry must include a YAML frontmatter.',
			'missingChangeSummary': 'Changelog entry must include a text summary.',
			'missingTypeField': 'Changelog entry must include a \'type\' field.',
			'invalidField': 'Invalid \'{{ kind }}\' value: \'{{ value }}\'.',
			'scopesInSingleRepository': 'Changelog entry for a single repository must not include the \'scopes\' field.',
			'defaultChangeSummary': 'Replace the default placeholder text with a meaningful summary.'
		}
	},

	create( context ) {
		const options = context.options[ 0 ];
		let hasFrontmatter = false;
		let hasText = false;

		return {
			text( node ) {
				hasText ||= true;

				if ( placeholderTexts.includes( node.value.trim() ) ) {
					return context.report( {
						node,
						messageId: 'defaultChangeSummary'
					} );
				}
			},

			yaml( node ) {
				hasFrontmatter ||= true;

				const lineCounter = new yaml.LineCounter();
				const doc = yaml.parseDocument( node.value, {
					lineCounter
				} );

				const getKey = key => doc.contents?.items?.find( item => item.key.value === key );

				[
					...validateType( getKey( 'type' ), options ),
					...validateScopes( getKey( 'scope' ), options ),
					...validateCloses( getKey( 'closes' ) ),
					...validateSee( getKey( 'see' ) ),
					...validateCommunityCredits( getKey( 'communityCredits' ) )
				]
					.forEach( ( { range, ...error } ) => {
						const lineOffset = node.position.start.line;
						const start = lineCounter.linePos( range[ 0 ] );
						const end = lineCounter.linePos( range[ 1 ] );

						context.report( {
							...error,
							loc: {
								start: {
									line: lineOffset + start.line,
									column: start.col
								},
								end: {
									line: lineOffset + end.line,
									column: end.col
								}
							}
						} );
					} );

				doc.errors
					.filter( ( { code } ) => code === 'TAB_AS_INDENT' )
					.forEach( ( { linePos } ) => {
						const lineOffset = node.position.start.line;

						context.report( {
							message: 'Indentation should use spaces instead of tabs.',
							loc: {
								start: {
									line: lineOffset + linePos[ 0 ].line,
									column: linePos[ 0 ].col
								},
								end: {
									line: lineOffset + linePos[ 1 ].line,
									column: linePos[ 1 ].col
								}
							}
						} );
					} );
			},

			'root:exit'( node ) {
				if ( !hasFrontmatter ) {
					// If frontmatter data is missing, display an error at the beginning of the file.
					context.report( {
						node: context.getSourceCode().ast,
						messageId: 'missingChangeData',
						loc: {
							start: {
								line: node.position.start.line,
								column: node.position.start.column
							},
							end: {
								line: node.position.start.line,
								column: node.position.start.column
							}
						}
					} );
				}

				if ( !hasText ) {
					// If text summary is missing, display an error at the end of the file.
					context.report( {
						node: context.getSourceCode().ast,
						messageId: 'missingChangeSummary',
						loc: {
							start: {
								line: node.position.end.line,
								column: node.position.end.column
							},
							end: {
								line: node.position.end.line,
								column: node.position.end.column
							}
						}
					} );
				}
			}
		};
	}
};

/**
 * Validates the "type" field of a changelog entry.
 */
function validateType( type, options ) {
	if ( !type ) {
		return [
			{
				messageId: 'missingTypeField',
				range: [ 0, 0 ]
			}
		];
	}

	const { source, range } = type.value;

	if ( ALLOWED_TYPES[ options.repositoryType ].includes( source.toLowerCase() ) ) {
		return [];
	}

	return [
		{
			messageId: 'invalidField',
			data: {
				kind: 'type',
				value: source
			},
			range
		}
	];
}

/**
 * Validates the "scopes" field of a changelog entry.
 */
function validateScopes( scopes, options ) {
	if ( !scopes ) {
		return [];
	}

	const normalized = toArray( scopes ).filter( scope => !!scope.source );

	if ( normalized.length && options.repositoryType === 'single' ) {
		return [
			{
				messageId: 'scopesInSingleRepository',
				range: scopes.key.range
			}
		];
	}

	return normalized.reduce( ( errors, scope ) => {
		if ( !options.allowedScopes.includes( scope.source ) ) {
			errors.push( {
				messageId: 'invalidField',
				data: {
					kind: 'scope',
					value: scope.source
				},
				range: scope.range
			} );
		}

		return errors;
	}, [] );
}

/**
 * Validates field containing issue in a changelog entry.
 */
function validateIssue( issue, kind ) {
	if ( !issue ) {
		return [];
	}

	return toArray( issue )
		.filter( issue => !!issue.source )
		.reduce( ( errors, issue ) => {
			if ( !ISSUE_SLUG_PATTERN.test( issue ) && !ISSUE_PATTERN.test( issue ) && !ISSUE_URL_PATTERN.test( issue ) ) {
				errors.push( {
					messageId: 'invalidField',
					data: {
						kind,
						value: issue.source
					},
					range: issue.range
				} );
			}

			return errors;
		}, [] );
}

/**
 * Validates the "closes" field of a changelog entry.
 */
function validateCloses( issue ) {
	return validateIssue( issue, 'closes' );
}

/**
 * Validates the "see" field of a changelog entry.
 */
function validateSee( issue ) {
	return validateIssue( issue, 'see' );
}

/**
 * Validates the "communityCredits" field of a changelog entry.
 */
function validateCommunityCredits( communityCredits ) {
	if ( !communityCredits ) {
		return [];
	}

	return toArray( communityCredits )
		.filter( issue => !!issue.source )
		.reduce( ( errors, credit ) => {
			if ( !NICK_NAME_PATTERN.test( credit ) ) {
				errors.push( {
					messageId: 'invalidField',
					data: {
						kind: 'communityCredits',
						value: credit.source
					},
					range: credit.range
				} );
			}

			return errors;
		}, [] );
}

/**
 * Ensures that the given pair is an array.
 */
function toArray( pair ) {
	return pair.value.items ?? [ pair.value ];
}
