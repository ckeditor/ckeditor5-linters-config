/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const PLUGIN_NAME_METHOD_NAME = 'pluginName';

module.exports = {
	meta: {
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Enforce the presence of the plugin flags.',
			category: 'CKEditor5'
		},
		schema: [
			{
				type: 'object',
				properties: {
					requiredFlags: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								returnValue: { type: 'boolean' }
							},
							required: [ 'name', 'returnValue' ]
						},
						optional: true
					},
					disallowedFlags: {
						type: 'array',
						items: {
							type: 'string'
						},
						optional: true
					}
				},
				additionalProperties: false
			}
		],
		messages: {
			disallowedFlag: 'The class member \'{{flag}}\' is disallowed here and should be removed.',
			missingRequiredFlag: 'The class should have a static getter method \'{{flag}}\' that returns {{returnValue}}.',
			incorrectReturnValue: 'The method \'{{flag}}\' should return {{returnValue}} but returns {{actualValue}} instead.',
			notPublicGetter: 'The method \'{{flag}}\' should be defined as a public getter method.'
		}
	},

	create( context ) {
		if ( !getRequiredFlagsConfig( context ).length && !getDisallowedFlagsConfig( context ).length ) {
			return {};
		}

		return {
			'ClassDeclaration:exit'( classDeclaration ) {
				if ( isPluginClassDeclaration( classDeclaration ) ) {
					analyzePluginClass( context, classDeclaration );
				}
			}
		};
	}
};

/**
 * Returns the required flags from the rule options.
 *
 * @param {Object} context The ESLint rule context.
 * @returns {Array.<Object>}
 */
function getRequiredFlagsConfig( context ) {
	return context.options[ 0 ]?.requiredFlags ?? [];
}

/**
 * Returns the disallowed flags from the rule options.
 *
 * @param {Object} context The ESLint rule context.
 * @returns {Array.<String>}
 */
function getDisallowedFlagsConfig( context ) {
	return context.options[ 0 ]?.disallowedFlags ?? [];
}

/**
 * Analyzes the plugin class declaration and performs all necessary checks and reports errors if needed.
 * What it does:
 *
 * 	* It checks if there are no disallowed flags.
 * 	* It checks if all required flags are defined in the class declaration.
 * 	* It checks if all required flags are defined after the `pluginName` method.
 * 	* It checks if all required flags are defined in the proper order (after each other).
 *
 * While checking the order might be not super important, it's a good practice to keep the flags in the same order
 * to avoid situations where the flags are scattered across the class. It unifies alignment of the methods with
 * auto-fixer which enforces defining all flags after the `pluginName` method (mostly because it simplifies the fixer).
 *
 * @param {Object} context The ESLint rule context.
 * @param {Object} classDeclaration The class declaration node to analyze.
 */
function analyzePluginClass( context, classDeclaration ) {
	checkIfThereAreNoDisallowedFlags( context, classDeclaration );
	checkIfAllFlagsAreProperlyDefined( context, classDeclaration );
}

/**
 * Checks if there are no disallowed flags defined in the class declaration.
 *
 * @param {Object} context The ESLint rule context.
 * @param {Object} classDeclaration The class declaration node to analyze.
 * @example
 *
 * Let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 * 	static get isOfficialPlugin() { return true; }
 * }
 * ```
 *
 * We disallowed the `isOfficialPlugin` method in the rule configuration.
 *
 * This check will report an error for the `isOfficialPlugin` method because it's disallowed.
 * It'll propose removing the method. Keep in mind that it depends on configuration and the disallowed flags might be different,
 */
function checkIfThereAreNoDisallowedFlags( context, classDeclaration ) {
	const staticMembers = getAllStaticMembers( classDeclaration );

	// Check if there is no absent flag defined in the class. If it is, report an error and propose fix.
	for ( const disallowedFlag of getDisallowedFlagsConfig( context ) ) {
		const definedNode = staticMembers.find( element => element.key?.name === disallowedFlag );

		// Check if the class has a static getter method with the required name.
		if ( definedNode ) {
			context.report( {
				node: definedNode,
				messageId: 'disallowedFlag',
				data: {
					flag: disallowedFlag
				}
			} );
		}
	}
}

/**
 * Checks if all required flags are properly defined in the class declaration.
 *
 * @param {Object} context The ESLint rule context.
 * @param {ASTNode} classDeclaration The class declaration node to analyze.
 * @example
 *
 * Scenario #1, missing required flag:
 *
 * Let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 * }
 * ```
 *
 * This check will report an error for the `isOfficialPlugin` method because it's missing.
 * Keep in mind that it depends on configuration and the required flags might be different,
 * so it's not always `isOfficialPlugin`.
 *
 * ---
 *
 * Scenario #2, incorrect return value:
 *
 * Let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 * 	static get isOfficialPlugin() { return false; }
 * }
 * ```
 *
 * This check will report an error for the `isOfficialPlugin` method because
 * it should return `true` but returns `false` instead.
 */
function checkIfAllFlagsAreProperlyDefined( context, classDeclaration ) {
	const staticClassGetters = getAllStaticGetters( classDeclaration );

	// Check if every required flag is defined in the class and propose fixes if not.
	for ( const requiredFlag of getRequiredFlagsConfig( context ) ) {
		const definedMethod = staticClassGetters.find( element => element.key.name === requiredFlag.name );

		// Check if the class has a static getter method with the required name.
		if ( !definedMethod ) {
			context.report( {
				node: classDeclaration,
				messageId: 'missingRequiredFlag',
				data: {
					flag: requiredFlag.name,
					returnValue: requiredFlag.returnValue
				}
			} );

			continue;
		}

		// Check if method is defined as a public getter method
		// It's not crucial for other eslint rules in this loop, so we can continue loop.
		if ( !definedMethod.accessibility || definedMethod.accessibility !== 'public' ) {
			context.report( {
				node: definedMethod,
				messageId: 'notPublicGetter',
				data: {
					flag: requiredFlag.name
				}
			} );
		}

		// Check if the method has a proper return type defined. In our scenario it should be equal to
		// `requiredFlag.returnValue` which is a boolean. Keep convention from the `ContextPlugin#isContextPlugin` method.
		if ( definedMethod.value?.returnType?.typeAnnotation?.literal?.value !== requiredFlag.returnValue ) {
			context.report( {
				node: definedMethod,
				messageId: 'incorrectReturnValue',
				data: {
					flag: requiredFlag.name,
					returnValue: requiredFlag.returnValue,
					actualValue: definedMethod.value?.returnType?.typeAnnotation?.literal?.value ?? 'other type'
				}
			} );
		}
	}
}

/**
 * Returns true if the class declaration extends the Plugin or ContextPlugin class.
 *
 * @param {Object} classDeclaration
 * @returns {Boolean}
 * @example
 *
 * Let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 * }
 * ```
 *
 * isPluginClassDeclaration( node ); // true
 */
function isPluginClassDeclaration( classDeclaration ) {
	// Check if the class extends the Plugin or ContextPlugin class.
	const extendedClassNames = extractFlatExtendedClassNames( classDeclaration );

	if ( !extendedClassNames.some( extendedClass => [ 'Plugin', 'ContextPlugin' ].includes( extendedClass ) ) ) {
		return false;
	}

	// Check if the class has a static getter method that returns the plugin name.
	return !!getPluginNameMethod( classDeclaration );
}

/**
 * Extracts all class names from the class declaration. It takes into account extended classes.
 *
 * @param {Object} classDeclaration
 * @returns {Array.<String>} The list of class names that the class extends.
 * @example
 *
 * Scenario #1, let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 * }
 * ```
 *
 * extractFlatExtendedClassNames( node ); // [ 'Plugin' ]
 *
 * ---
 *
 * Scenario #2, let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends MagicMixin( Plugin, Plugin2 ) {
 * 	static get pluginName() { return 'TestPlugin'; }
 * }
 * ```
 *
 * extractFlatExtendedClassNames( node ); // [ 'Plugin', 'Plugin2' ]
 */
function extractFlatExtendedClassNames( classDeclaration ) {
	function unrollExtendStatements( node ) {
		if ( !node ) {
			return [];
		}

		// It looks like class extends another class using mixin.
		// Let's extract all class names from the mixin walking through the arguments.
		// Example of the mixin extend: `class TestPlugin extends MagicMixin( BasePlugin, BasePlugin2, ... ) { ... }`
		if ( node.type === 'CallExpression' &&
				node.callee.type === 'Identifier' &&
				node.callee.name.endsWith( 'Mixin' ) ) {
			return ( node.callee.parent?.arguments || [] ).flatMap( unrollExtendStatements );
		}

		// It looks like we encountered normal class extend identifier. Let's collect it.
		if ( node.type === 'Identifier' && node.name ) {
			return [ node.name ];
		}

		// It looks like we encountered another class extend. Let's ignore it.
		return [];
	}

	return unrollExtendStatements( classDeclaration.superClass );
}

/**
 * Retrieves the method that gets the plugin name from a class declaration.
 *
 * @param {Object} classDeclaration - The class declaration node to search for the plugin name method.
 * @returns {Object|undefined} The method node if found, otherwise undefined.
 */
function getPluginNameMethod( classDeclaration ) {
	return getAllStaticGetters( classDeclaration ).find( element => element.key.name === PLUGIN_NAME_METHOD_NAME );
}

/**
 * Returns all static getters from the class declaration
 *
 * @param {Object} classDeclaration
 * @returns {Array.<Object>}
 * @example
 * ```
 * getAllClassDeclarationMethods( node ); // [ { type: 'MethodDefinition', key: { name: 'pluginName' }, static: true }, ... ]
 * ```
 */
function getAllStaticGetters( classDeclaration ) {
	return getAllClassMembers( classDeclaration ).filter( isStaticGetterMethod );
}

/**
 * Returns all static members from the class declaration
 *
 * @param {Object} classDeclaration
 * @returns {Array.<Object>}
 */
function getAllStaticMembers( classDeclaration ) {
	return getAllClassMembers( classDeclaration ).filter( node => node.static );
}

/**
 * Returns all class body nodes.
 *
 * @param {Object} classDeclaration
 * @returns {Array.<Object>} The class body nodes.
 */
function getAllClassMembers( classDeclaration ) {
	return classDeclaration.body.body;
}

/**
 * Returns true if the method is a static getter method.
 *
 * @param {Object} method
 * @returns {Boolean} True if the method is a static getter method.
 */
function isStaticGetterMethod( method ) {
	return method.static && method.type === 'MethodDefinition' && method.kind === 'get';
}
