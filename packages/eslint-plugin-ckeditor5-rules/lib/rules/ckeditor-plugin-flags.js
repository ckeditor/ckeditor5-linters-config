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
			incorrectReturnLiteral: 'The method \'{{flag}}\' should return a literal value with the {{returnValue}} value.',
			notPublicGetter: 'The method \'{{flag}}\' should be defined as a public getter method.',
			singleReturnStatement: 'The method \'{{flag}}\' should have a single return statement.',
			definedBeforePluginName: 'The method \'{{flag}}\' should be defined after the \'pluginName\' method.',
			definedInProperOrder: 'The method \'{{flag}}\' should be defined directly after other flag method.',
			definedAfterSpecificMethod: 'The method \'{{flag}}\' should be defined after the \'{{before}}\' method.'
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

	const misalignedMethods = checkIfFlagsAreDefinedAfterPluginName( context, classDeclaration );

	checkIfFlagsDefinedInProperOrder( context, classDeclaration, misalignedMethods );
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
				fix: createRemoveClassMembersFixer( context, classDeclaration, [ disallowedFlag ] ),
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
				fix: createPluginsFlagsFixer( context, classDeclaration ),
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
				fix: createPluginsFlagsFixer( context, classDeclaration ),
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
				fix: createPluginsFlagsFixer( context, classDeclaration ),
				messageId: 'incorrectReturnValue',
				data: {
					flag: requiredFlag.name,
					returnValue: requiredFlag.returnValue,
					actualValue: definedMethod.value?.returnType?.typeAnnotation?.literal?.value ?? 'other type'
				}
			} );
		}

		// Prevent adding advanced logic to the flag method. It should be a simple getter with single return statement.
		const { body: methodBody } = definedMethod.value.body;

		if ( methodBody.length !== 1 || methodBody[ 0 ].type !== 'ReturnStatement' ) {
			context.report( {
				node: definedMethod,
				fix: createPluginsFlagsFixer( context, classDeclaration ),
				messageId: 'singleReturnStatement',
				data: {
					flag: requiredFlag.name
				}
			} );

			continue;
		}

		// Check if the method returns the required value and that the value is a literal.
		const { argument } = methodBody[ 0 ];

		if ( argument.type !== 'Literal' || argument.value !== requiredFlag.returnValue ) {
			context.report( {
				node: argument,
				fix: createPluginsFlagsFixer( context, classDeclaration ),
				messageId: 'incorrectReturnLiteral',
				data: {
					flag: requiredFlag.name,
					returnValue: requiredFlag.returnValue
				}
			} );
		}
	}
}

/**
 * Checks if all required flags are defined **after** the `pluginName` method.
 *
 * @param {Object} context The ESLint rule context.
 * @param {Object} classDeclaration The class declaration node to analyze.
 * @returns {Array.<Object>} A list of methods that should be ignored in the next check.
 * @example
 *
 * Let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get isPremiumPlugin() { return true; }
 * 	static get pluginName() { return 'TestPlugin'; }
 * }
 * ```
 *
 * This check will report an error for the `isPremiumPlugin` method because
 * it should be defined after the `pluginName` method.
 */
function checkIfFlagsAreDefinedAfterPluginName( context, classDeclaration ) {
	const staticClassGetters = getAllStaticGetters( classDeclaration );
	const methodsAfterPluginName = staticClassGetters.slice(
		staticClassGetters.indexOf( getPluginNameMethod( classDeclaration ) ) + 1
	);

	// Check if every required flag is defined in the proper order
	// If not then collect all methods that are in the wrong order to ignore them in the next check.
	const flagsDefinedBeforePluginName = getRequiredFlagsConfig( context ).flatMap( requiredFlag => {
		const matchedGettersBeforeRequiredFlag = staticClassGetters.filter(
			staticGetter =>
				staticGetter.key.name === requiredFlag.name &&
				!methodsAfterPluginName.includes( staticGetter )
		);

		if ( matchedGettersBeforeRequiredFlag.length ) {
			return [ [ requiredFlag, matchedGettersBeforeRequiredFlag ] ];
		}

		return [];
	} );

	// Report an error for every flag that is defined before the `pluginName` method.
	for ( const [ requiredFlag, methodsSomewhereInClass ] of flagsDefinedBeforePluginName ) {
		// There is edge case scenario where the flag is defined multiple times in the class so handle it as well.
		for ( const affectedMethod of methodsSomewhereInClass ) {
			context.report( {
				node: affectedMethod,
				fix: createPluginsFlagsFixer( context, classDeclaration ),
				messageId: 'definedBeforePluginName',
				data: {
					flag: requiredFlag.name
				}
			} );
		}
	}

	// Return plain list of methods that are in the wrong order to ignore them in the next check.
	return flagsDefinedBeforePluginName.flatMap( ( [ , methodsSomewhereInClass ] ) => methodsSomewhereInClass );
}

/**
 * Checks if all required flags are defined in the proper order.
 *
 * @param {Object} context The ESLint rule context.
 * @param {Object} classDeclaration The class declaration node to analyze.
 * @param {Array.<Object>} ignoredMethods A list of methods that should be ignored during the check.
 * @example
 *
 * Let's assume we have the following class declaration:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 * 	static get isOfficialPlugin() { return true; }
 * 	constructor() { super(); }
 * 	static get isPremiumPlugin() { return false; }
 * }
 * ```
 *
 * This check will report an error for the `isPremiumPlugin` method because it
 * should be defined directly after the `isOfficialPlugin` method.
 */
function checkIfFlagsDefinedInProperOrder( context, classDeclaration, ignoredMethods = [] ) {
	const orderedMethodsLinkedList = getRequiredFlagsConfig( context ).map( ( flag, index, array ) => ( {
		name: flag.name,
		before: {
			name: array[ index - 1 ]?.name || PLUGIN_NAME_METHOD_NAME
		}
	} ) );

	let lastGetterMethod = null;

	for ( const classNode of getAllClassMembers( classDeclaration ) ) {
		// Ignore if method signature is not a getter or it's not a static method.
		if ( !isStaticGetterMethod( classNode ) ) {
			lastGetterMethod = null;
			continue;
		}

		// Check if method was reported by one of previous analyzers. If so, ignore it, do not report similar error twice.
		if ( ignoredMethods.includes( classNode ) ) {
			continue;
		}

		// Ignore if method is not a flag method.
		const flagMethod = orderedMethodsLinkedList.find( element => element.name === classNode.key.name );

		if ( flagMethod ) {
			if ( !lastGetterMethod ) {
				// If there is no last method, it means that the current method is the first flag method after
				// constructor or any other non-flag method. It's bad.
				context.report( {
					node: classNode,
					fix: createPluginsFlagsFixer( context, classDeclaration ),
					messageId: 'definedInProperOrder',
					data: {
						flag: classNode.key.name
					}
				} );
			} else if ( lastGetterMethod && lastGetterMethod.key.name !== flagMethod.before.name ) {
				// If the last flag method is not the one that should be before the current flag method, report an error.
				context.report( {
					node: classNode,
					fix: createPluginsFlagsFixer( context, classDeclaration ),
					messageId: 'definedAfterSpecificMethod',
					data: {
						flag: classNode.key.name,
						before: flagMethod.before.name
					}
				} );
			}
		}

		lastGetterMethod = classNode;
	}
}

/**
 * Creates a fixer for the plugin flags.
 * It removes all methods that are named as required flags and adds new ones in proper order and place.
 *
 * @param {Object} context
 * @param {Object} classDeclaration
 * @returns {Function}
 * @example
 *
 * It removes all methods that are named as required flags and adds new ones in proper order and place.
 * Like in the example below, it will change:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 * }
 * ```
 *
 * to:
 *
 * ```
 * class TestPlugin extends Plugin {
 * 	static get pluginName() { return 'TestPlugin'; }
 *
 * 	public static get isOfficialPlugin(): true {
 * 		return true;
 * 	}
 * }
 * ```
 */
function createPluginsFlagsFixer( context, classDeclaration ) {
	const requiredFlags = getRequiredFlagsConfig( context );
	const removeMethodFixer = createRemoveClassMembersFixer(
		context,
		classDeclaration,
		requiredFlags.map( flag => flag.name )
	);

	return fixer => {
		// Remove all methods that are named as required flags.
		const removedMethodsFixes = removeMethodFixer( fixer );

		// Inject new required flags getters at the top of the class declaration.
		const pluginNameMethod = getPluginNameMethod( classDeclaration );
		const indent = '\t'.repeat( pluginNameMethod.loc.start.column );

		const injectedMethodsFixes = requiredFlags.map( ( requiredFlag, index ) => {
			const isLastIndex = index === requiredFlags.length - 1;

			// Eslint indent handling is a bit tricky. Only the first inserted method line is indented properly.
			// The next ones need to be indented manually. The last one have have to be indented in both directions
			// because eslint seems to be removing indention of the `pluginNameMethod` line.
			const method =
				`${ index ? '' : '\n\n' }${ indent }/**\n` +
				`${ indent } * @inheritDoc\n` +
				`${ indent } */\n` +
				`${ indent }public static override get ${ requiredFlag.name }(): ${ requiredFlag.returnValue } {\n` +
				`${ indent }\treturn ${ requiredFlag.returnValue };\n` +
				`${ indent }}${ isLastIndex ? '' : '\n\n' }`;

			return fixer.insertTextAfter( pluginNameMethod, method );
		} );

		return [
			...removedMethodsFixes,
			...injectedMethodsFixes
		];
	};
}

/**
 * Creates fixer for removing class methods by their names.
 *
 * @param {Object} context
 * @param {Object} classDeclaration
 * @param {Array.<String>} names
 * @returns {Function}
 */
function createRemoveClassMembersFixer( context, classDeclaration, names ) {
	// Cache last removed new line to avoid overlapping ranges during removal of multiple methods
	let lastRemovedNewLine = 0;

	// Remove all methods that are named like the flags.
	return fixer => {
		const ranges = getAllClassMembers( classDeclaration )
			.filter( element => names.includes( element.key?.name ) )
			.map( method => {
				const sourceCode = context.getSourceCode();
				const commentsBeforeMethod = sourceCode.getCommentsBefore( method );

				const endRange = sourceCode.text.indexOf( '\n', method.range[ 1 ] ) + 1;
				let startRange = sourceCode.text.lastIndexOf( '\n', commentsBeforeMethod[ 0 ]?.range[ 0 ] || method.range[ 0 ] );

				// Prevent incorrect formatting of the methods that have no space between them.
				// It prevents eating new line from the previous method.
				if ( sourceCode.text[ startRange - 1 ].trim() === '}' ) {
					startRange++;
				}

				// It prevents overlapping ranges when removing multiple methods.
				// From time to time endline from previous and current method are the same which causes eslint to throw an error.
				if ( startRange < lastRemovedNewLine ) {
					startRange = lastRemovedNewLine + 1;
				}

				lastRemovedNewLine = endRange;

				return [ startRange, endRange ];
			} );

		// Detect overlapping ranges before creating fixes. It's better to report a warning
		// than crashing whole eslint process. This usually happens when the parser struggles with
		// removing multiple methods at once that share the same endline. It should be handled in the code above
		// but it's better to have a safety net here.
		for ( let i = 0; i < ranges.length - 1; i++ ) {
			// It looks like ranges overlap lets abort the fixer.
			if ( ranges[ i ][ 1 ] > ranges[ i + 1 ][ 0 ] ) {
				return [];
			}
		}

		return ranges.map( range => fixer.removeRange( range ) );
	};
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
