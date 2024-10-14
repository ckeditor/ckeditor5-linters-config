/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parser: require.resolve( '@typescript-eslint/parser' )
} );

ruleTester.run( 'ckeditor-plugin-flags', require( '../../lib/rules/ckeditor-plugin-flags' ), {
	valid: [
		// Should not raise any error when empty non-plugin class is checked.
		{
			code: 'class Abc {}',
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						}
					]
				}
			]
		},

		// Check if class that does not extend Plugin is not checked.
		{
			code: 'class TestNonPlugin { static get pluginName() { return \'TestNonPlugin\'; } }',
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						}
					]
				}
			]
		},

		// Check if class that extends Plugin but do not define pluginName is not checked.
		{
			code: 'class TestPlugin extends Plugin {}',
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						}
					]
				}
			]
		},

		// Check if class containing specified methods is checked.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }
					public static override get isOfficialPlugin(): true { return true; }
					public static override get isPremiumPlugin(): false { return false; }
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						},
						{
							name: 'isPremiumPlugin',
							returnValue: false
						}
					]
				}
			]
		}
	],
	invalid: [
		// Should properly fix non-spaced method definition when there are multiple disallowed flags.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }
					public static override get isOfficialPlugin(): true { return true; }
					public static override get isPremiumPlugin(): false { return false; }
					public static override get isNotOfficialPlugin(): false { return false; }
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }
					public static override get isPremiumPlugin(): false { return false; }
				}
			`,
			options: [
				{
					disallowedFlags: [ 'isOfficialPlugin', 'isNotOfficialPlugin' ]
				}
			],
			errors: [
				{ messageId: 'disallowedFlag' },
				{ messageId: 'disallowedFlag' }
			]
		},

		// Should raise error if there is disallowed properties in the class.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					public static override get isOfficialPlugin(): true { return true; }

					public static override get isPremiumPlugin(): false { return false; }

					public static override get isNotOfficialPlugin(): false { return false; }
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					public static override get isPremiumPlugin(): false { return false; }
				}
			`,
			options: [
				{
					disallowedFlags: [ 'isOfficialPlugin', 'isNotOfficialPlugin' ]
				}
			],
			errors: [
				{ messageId: 'disallowedFlag' },
				{ messageId: 'disallowedFlag' }
			]
		},

		// Should raise error when plugin class does not have required flags.
		{
			code: `
				class TestNonPlugin extends Plugin {
					static get pluginName() { return 'TestNonPlugin'; }
				}
			`,
			output: `
				class TestNonPlugin extends Plugin {
					static get pluginName() { return 'TestNonPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): true {
						return true;
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						},
						{
							name: 'isPremiumPlugin',
							returnValue: true
						}
					]
				}
			],
			errors: [
				{ messageId: 'missingRequiredFlag' },
				{ messageId: 'missingRequiredFlag' }
			]
		},

		// Should properly recognize missing required flags on plugin that extends mixin.
		{
			code: `
				class FormatPainterUI extends /* #__PURE__ -- @preserve */ DomEmitterMixin( Plugin ) {
					/**
					 * @inheritDoc
					 */
					public static get pluginName() {
						return 'FormatPainterUI' as const;
					}
				}
			`,
			output: `
				class FormatPainterUI extends /* #__PURE__ -- @preserve */ DomEmitterMixin( Plugin ) {
					/**
					 * @inheritDoc
					 */
					public static get pluginName() {
						return 'FormatPainterUI' as const;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): true {
						return true;
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						},
						{
							name: 'isPremiumPlugin',
							returnValue: true
						}
					]
				}
			],
			errors: [
				{ messageId: 'missingRequiredFlag' },
				{ messageId: 'missingRequiredFlag' }
			]
		},

		// Should properly fix non spaced method definition when there are multiple required flags.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }
					public static override get isOfficialPlugin(): false { return false; }
					public static override get isPremiumPlugin(): true { return true; }
					public foo() {}
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): false {
						return false;
					}
					public foo() {}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						},
						{
							name: 'isPremiumPlugin',
							returnValue: false
						}
					]
				}
			],
			errors: [
				{ messageId: 'incorrectReturnValue' },
				{ messageId: 'incorrectReturnLiteral' },
				{ messageId: 'incorrectReturnValue' },
				{ messageId: 'incorrectReturnLiteral' }
			]
		},

		// Should raise error when plugin class has required flags with wrong return value.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					public static override get isOfficialPlugin(): false { return false; }

					public static override get isPremiumPlugin(): true { return true; }
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): false {
						return false;
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						},
						{
							name: 'isPremiumPlugin',
							returnValue: false
						}
					]
				}
			],
			errors: [
				{ messageId: 'incorrectReturnValue' },
				{ messageId: 'incorrectReturnLiteral' },
				{ messageId: 'incorrectReturnValue' },
				{ messageId: 'incorrectReturnLiteral' }
			]
		},

		// Should raise error if return value is not a single return statement.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					public static override get isOfficialPlugin(): true {
						if ( true ) {
							return true;
						}

						return false;
					}
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						}
					]
				}
			],
			errors: [
				{ messageId: 'singleReturnStatement' }
			]
		},

		// Should raise error if method has no public modifier.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					private static get isOfficialPlugin(): true { return true; }
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						}
					]
				}
			],
			errors: [
				{ messageId: 'notPublicGetter' }
			]
		},

		// Should raise error if flag is defined before pluginName.
		{
			code: `
				class TestPlugin extends Plugin {
					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					static get pluginName() { return 'TestPlugin'; }
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						}
					]
				}
			],
			errors: [
				{ messageId: 'definedBeforePluginName' }
			]
		},

		// Should raise error if flags are not defined in proper order.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): false {
						return false;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): false {
						return false;
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						},
						{
							name: 'isPremiumPlugin',
							returnValue: false
						}
					]
				}
			],
			errors: [
				{ messageId: 'definedAfterSpecificMethod' },
				{ messageId: 'definedAfterSpecificMethod' }
			]
		},

		// Should raise error about incorrect flags order if there is constructor between flags.
		{
			code: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					constructor() {
						super();
					}

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): false {
						return false;
					}
				}
			`,
			output: `
				class TestPlugin extends Plugin {
					static get pluginName() { return 'TestPlugin'; }

					/**
					 * @inheritDoc
					 */
					public static override get isOfficialPlugin(): true {
						return true;
					}

					/**
					 * @inheritDoc
					 */
					public static override get isPremiumPlugin(): false {
						return false;
					}

					constructor() {
						super();
					}
				}
			`,
			options: [
				{
					requiredFlags: [
						{
							name: 'isOfficialPlugin',
							returnValue: true
						},
						{
							name: 'isPremiumPlugin',
							returnValue: false
						}
					]
				}
			],
			errors: [
				{ messageId: 'definedInProperOrder' }
			]
		}
	]
} );
