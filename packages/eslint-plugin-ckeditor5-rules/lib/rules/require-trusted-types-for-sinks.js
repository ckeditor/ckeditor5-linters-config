/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/**
 * The helpers that prepare a value for a sink, the module they are imported from, and the name of the directory of that
 * module, in which a file cannot import from the module's own name.
 */
const HTML_HELPER = 'trustedHtml';
const ATTRIBUTE_HELPER = '_trustedAttributeValue';
const HELPERS_MODULE = '@ckeditor/ckeditor5-utils';
const HELPERS_MODULE_DIRECTORY = 'ckeditor5-utils';

/**
 * Properties that turn a string into DOM when assigned to.
 */
const SINK_PROPERTIES = new Set( [ 'innerHTML', 'outerHTML', 'srcdoc' ] );

/**
 * Methods that turn a string into DOM, each with the position of its HTML argument.
 */
const SINK_METHODS = new Map( [
	[ 'parseFromString', 0 ],
	[ 'createContextualFragment', 0 ],
	[ 'insertAdjacentHTML', 1 ],
	[ 'setHTMLUnsafe', 0 ],
	[ 'parseHTMLUnsafe', 0 ],
	[ 'write', 0 ],
	[ 'writeln', 0 ]
] );

/**
 * Methods that set an attribute, each with the position of the attribute name and the value.
 */
const ATTRIBUTE_METHODS = new Map( [
	[ 'setAttribute', { name: 0, value: 1 } ],
	[ 'setAttributeNS', { name: 1, value: 2 } ]
] );

/**
 * The attributes that take a Trusted Type: event handlers on every element, and `srcdoc` on an `<iframe>`, the only
 * element that has it. Others, such as `src` of a `<script>`, share their name with attributes of ordinary elements,
 * which the rule cannot tell apart, so they are left out.
 */
const TRUSTED_ATTRIBUTE_PATTERN = /^(?:on.+|srcdoc)$/i;

/**
 * The DOM interfaces that own the sinks above. A type counts only when it is, or extends, one of them as declared by
 * the TypeScript DOM library, so that a class of the same name elsewhere does not match.
 */
const SINK_OWNER_TYPES = new Set( [ 'Element', 'ShadowRoot', 'Document', 'DOMParser', 'Range' ] );

/**
 * The DOM interface that the argument of a function from the `htmlWritingFunctions` option must be.
 */
const NODE_TYPES = new Set( [ 'Node' ] );

const EXPRESSION_WRAPPERS = new Set( [
	'ChainExpression',
	'TSAsExpression',
	'TSNonNullExpression',
	'TSSatisfiesExpression',
	'TSTypeAssertion'
] );

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Require values passed to DOM injection sinks to go through the Trusted Types helpers',
			category: 'CKEditor5',
			requiresTypeChecking: true
		},
		hasSuggestions: true,
		schema: [
			{
				type: 'object',
				properties: {
					htmlWritingFunctions: {
						type: 'object',
						additionalProperties: { type: 'integer', minimum: 0 }
					}
				},
				additionalProperties: false
			}
		],
		defaultOptions: [ { htmlWritingFunctions: {} } ],
		messages: {
			/* eslint-disable @stylistic/max-len */
			property: 'Assign to `{{ name }}` only a value returned directly by `trustedHtml()`. The browser rejects a plain string here when Trusted Types are enforced.',
			compoundAssignment: '`+=` on `{{ name }}` reads the property, joins the strings and assigns a plain string, which the browser rejects when Trusted Types are enforced, even if the added part comes from `trustedHtml()`. Build the whole HTML first and assign it with `= trustedHtml( ... )`.',
			method: 'Pass to `{{ name }}()` only HTML returned directly by `trustedHtml()`. The browser rejects a plain string here when Trusted Types are enforced.',
			dynamicAttribute: 'Pass to `{{ name }}()` only a value returned directly by `_trustedAttributeValue()`, called with the same element and attribute name. The attribute name can be any attribute, including one that rejects a plain string when Trusted Types are enforced.',
			trustedAttribute: 'Pass to `{{ name }}()` only a value returned directly by `_trustedAttributeValue()`, called with the same element and attribute name. The `{{ attribute }}` attribute rejects a plain string when Trusted Types are enforced.',
			attributeHelperMismatch: 'Call `_trustedAttributeValue()` with the same element and attribute name as `{{ name }}()`, otherwise it prepares the value for a different attribute.',
			htmlWritingFunction: 'Pass a DOM node to `{{ name }}()`. Given a string, it writes the string to a sink of its own, which the browser rejects when Trusted Types are enforced.',
			wrapInHelper: 'Wrap the value in `{{ helper }}()`. It cleans nothing, so do this only for a value that the code produces itself, never for content.'
			/* eslint-enable @stylistic/max-len */
		}
	},

	create( context ) {
		const sourceCode = context.sourceCode;
		const services = sourceCode.parserServices;

		if ( !services.program ) {
			throw new Error(
				'The "require-trusted-types-for-sinks" rule requires type information. Enable it only for files covered by ' +
				'a TypeScript project, and set `parserOptions.projectService` (or `parserOptions.project`) for them.'
			);
		}

		const [ { htmlWritingFunctions } ] = context.options;

		const program = services.program;
		const checker = program.getTypeChecker();
		const untypedFlags = checker.getAnyType().flags | checker.getUnknownType().flags;
		const stringType = checker.getStringType();

		return {
			AssignmentExpression( node ) {
				const left = unwrapExpression( node.left );

				if ( left.type !== 'MemberExpression' ) {
					return;
				}

				const name = getSinkProperty( left );

				if ( !name || !isSinkReceiver( left.object ) ) {
					return;
				}

				// `+=` reads the property, joins the strings and assigns the plain string that comes out, so the browser
				// rejects it however the right-hand side was built.
				if ( node.operator === '+=' ) {
					context.report( { node, messageId: 'compoundAssignment', data: { name } } );
				} else if ( !isCallTo( node.right, HTML_HELPER ) ) {
					reportHtml( node, 'property', name, node.right );
				}
			},

			CallExpression( node ) {
				const callee = unwrapExpression( node.callee );

				if ( callee.type === 'Identifier' && Object.hasOwn( htmlWritingFunctions, callee.name ) ) {
					checkHtmlWritingFunction( node, callee.name );
				}

				if ( callee.type !== 'MemberExpression' ) {
					return;
				}

				const method = getPropertyName( callee );

				if ( SINK_METHODS.has( method ) ) {
					checkSinkMethod( node, callee, method );
				} else if ( ATTRIBUTE_METHODS.has( method ) ) {
					checkAttributeMethod( node, callee, method );
				}
			}
		};

		/**
		 * element.insertAdjacentHTML( 'beforeend', html ); // not allowed
		 */
		function checkSinkMethod( node, callee, method ) {
			const argument = node.arguments[ SINK_METHODS.get( method ) ];

			if ( argument && argument.type !== 'SpreadElement' && !isCallTo( argument, HTML_HELPER ) &&
				isSinkReceiver( callee.object )
			) {
				reportHtml( node, 'method', method, argument );
			}
		}

		/**
		 * element.setAttribute( name, value ); // not allowed
		 * element.setAttribute( name, _trustedAttributeValue( element, name, value ) ); // allowed
		 */
		function checkAttributeMethod( node, callee, method ) {
			const positions = ATTRIBUTE_METHODS.get( method );
			const nameArgument = node.arguments[ positions.name ];
			const valueArgument = node.arguments[ positions.value ];

			if ( !valueArgument || nameArgument.type === 'SpreadElement' || valueArgument.type === 'SpreadElement' ||
				!isSinkReceiver( callee.object )
			) {
				return;
			}

			// The name given to `setAttributeNS()` can have a prefix, as in `xlink:href`.
			const names = getStringLiterals( nameArgument );
			const attribute = names?.find( name => TRUSTED_ATTRIBUTE_PATTERN.test( name.split( ':' ).pop() ) );

			if ( names && !attribute ) {
				return;
			}

			const value = unwrapExpression( valueArgument );

			if ( isCallTo( value, ATTRIBUTE_HELPER ) ) {
				const [ elementText, attributeText ] = value.arguments.slice( 0, 2 ).map( getUnwrappedText );

				if ( elementText !== getUnwrappedText( callee.object ) || attributeText !== getUnwrappedText( nameArgument ) ) {
					context.report( { node, messageId: 'attributeHelperMismatch', data: { name: method } } );
				}

				return;
			}

			// The element and the name are written as they are, so that a non-null assertion or a type assertion on them still
			// holds for the helper.
			const leadingArguments = [ sourceCode.getText( callee.object ), sourceCode.getText( nameArgument ) ];

			context.report( {
				node,
				messageId: attribute ? 'trustedAttribute' : 'dynamicAttribute',
				data: { name: method, attribute },
				// The element and the name are repeated in the call, which is safe only when reading them has no side effects.
				suggest: isSideEffectFree( callee.object ) && isSideEffectFree( nameArgument ) ? [ {
					messageId: 'wrapInHelper',
					data: { helper: ATTRIBUTE_HELPER },
					fix: fixer => wrapInHelper( fixer, valueArgument, ATTRIBUTE_HELPER, leadingArguments )
				} ] : []
			} );
		}

		/**
		 * morphdom( element, html ); // not allowed, with `htmlWritingFunctions: { morphdom: 1 }`
		 * morphdom( element, newElement ); // allowed
		 *
		 * Such a function writes a string it is given to a sink in its own code, where neither helper can reach it, so only
		 * a DOM node keeps the string away from the sink. Every member of the type of the argument must be one.
		 */
		function checkHtmlWritingFunction( node, name ) {
			const argument = node.arguments[ htmlWritingFunctions[ name ] ];
			const type = argument && checker.getNonNullableType( services.getTypeAtLocation( argument ) );

			if ( type && !getUnionMembers( type ).every( member => isDomType( member, NODE_TYPES ) ) ) {
				context.report( { node, messageId: 'htmlWritingFunction', data: { name } } );
			}
		}

		/**
		 * Reports an HTML sink, with a suggestion to wrap its value.
		 */
		function reportHtml( node, messageId, name, value ) {
			context.report( {
				node,
				messageId,
				data: { name },
				suggest: [ {
					messageId: 'wrapInHelper',
					data: { helper: HTML_HELPER },
					fix: fixer => wrapInHelper( fixer, value, HTML_HELPER, [] )
				} ]
			} );
		}

		/**
		 * Returns the name of the sink property that a member expression points at, or `null` when it points at none. A
		 * computed key is read from its type, so that `element[ name ]` counts when `name` can hold the name of a sink, for
		 * example when it is `keyof HTMLElement`. A key that can be any string is left alone: on a DOM element it does not
		 * compile, so it is found only on objects that are typed as something else.
		 */
		function getSinkProperty( member ) {
			const names = member.computed ? getStringLiterals( member.property ) ?? [] : [ getPropertyName( member ) ];

			return names.find( name => SINK_PROPERTIES.has( name ) ) ?? null;
		}

		/**
		 * Returns the string values that an expression can have, or `null` when its type allows any string. Members of the
		 * type that are not strings, such as numbers, are skipped, because they cannot spell a name.
		 */
		function getStringLiterals( node ) {
			const types = getUnionMembers( services.getTypeAtLocation( node ) );

			if ( types.some( type => !type.isStringLiteral() && checker.isTypeAssignableTo( type, stringType ) ) ) {
				return null;
			}

			return types.filter( type => type.isStringLiteral() ).map( type => type.value );
		}

		/**
		 * Whether an expression holds a DOM object that owns a sink. One of an unknown type, such as `any`, counts too,
		 * because the rule cannot tell what it holds. The expression is not unwrapped, so that a type assertion such as
		 * `( node as HTMLElement )` gives the type that the code relies on.
		 */
		function isSinkReceiver( node ) {
			const type = services.getTypeAtLocation( node );

			// The constructor of a DOM interface counts as well, for the static `Document.parseHTMLUnsafe()`. It is checked one
			// level deep only, because a type can have a constructor that returns the type itself.
			return !!( type.flags & untypedFlags ) || getUnionMembers( type ).some( member =>
				isDomType( member, SINK_OWNER_TYPES ) ||
				member.getConstructSignatures().some( signature => isDomType( signature.getReturnType(), SINK_OWNER_TYPES ) )
			);
		}

		/**
		 * Returns the members of a union, with a type parameter replaced by its constraint.
		 */
		function getUnionMembers( type ) {
			const resolved = checker.getBaseConstraintOfType( type ) ?? type;

			return resolved.isUnion() ? resolved.types : [ resolved ];
		}

		/**
		 * Whether a type is, or extends, one of the given DOM interfaces.
		 */
		function isDomType( type, names ) {
			const symbol = type.getSymbol();

			if ( names.has( symbol?.name ) &&
				symbol.declarations.some( declaration => program.isSourceFileDefaultLibrary( declaration.getSourceFile() ) )
			) {
				return true;
			}

			const target = type.target ?? type;

			return ( type.isIntersection() && type.types.some( member => isDomType( member, names ) ) ) ||
				( target.isClassOrInterface() && checker.getBaseTypes( target ).some( base => isDomType( base, names ) ) );
		}

		/**
		 * Wraps a value in a call to a helper and imports the helper when the file does not have it yet. Nothing is imported
		 * into the helpers module itself, which cannot import from its own name, so the import is left for whoever applies
		 * the suggestion.
		 */
		function* wrapInHelper( fixer, value, helper, leadingArguments ) {
			const valueText = sourceCode.getText( value );
			const argument = value.type === 'SequenceExpression' ? `( ${ valueText } )` : valueText;

			yield fixer.replaceText( value, `${ helper }( ${ [ ...leadingArguments, argument ].join( ', ' ) } )` );

			if ( !isInScope( value, helper ) && !context.physicalFilename.split( /[\\/]/ ).includes( HELPERS_MODULE_DIRECTORY ) ) {
				yield* importHelper( fixer, helper );
			}
		}

		/**
		 * Adds a helper to the existing named import from the helpers module, or adds a new import when there is none.
		 */
		function* importHelper( fixer, helper ) {
			const imports = sourceCode.ast.body.filter( statement => statement.type === 'ImportDeclaration' );
			const declaration = imports.findLast( declaration =>
				declaration.source.value === HELPERS_MODULE && declaration.specifiers.at( -1 )?.type === 'ImportSpecifier'
			);

			if ( !declaration ) {
				const statement = `import { ${ helper } } from '${ HELPERS_MODULE }';`;

				yield imports.length ?
					fixer.insertTextAfter( imports.at( -1 ), `\n${ statement }` ) :
					fixer.insertTextBefore( sourceCode.ast.body[ 0 ], `${ statement }\n\n` );

				return;
			}

			yield fixer.insertTextAfter( declaration.specifiers.at( -1 ), `, ${ helper }` );

			// A type-only import becomes `import { type A, helper }`, because a second import from the same module would break
			// the `no-duplicate-imports` rule.
			if ( declaration.importKind === 'type' ) {
				const [ importToken, typeToken ] = sourceCode.getFirstTokens( declaration, 2 );

				yield fixer.removeRange( [ importToken.range[ 1 ], typeToken.range[ 1 ] ] );

				for ( const specifier of declaration.specifiers ) {
					yield fixer.insertTextBefore( specifier, 'type ' );
				}
			}
		}

		/**
		 * Whether a name is defined in the scope of a node, by an import or a declaration.
		 */
		function isInScope( node, name ) {
			for ( let scope = sourceCode.getScope( node ); scope; scope = scope.upper ) {
				if ( scope.set.get( name )?.defs.length ) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Returns the source text of an expression without its TypeScript and optional chaining wrappers.
		 */
		function getUnwrappedText( node ) {
			return sourceCode.getText( unwrapExpression( node ) );
		}
	}
};

/**
 * Returns the name of the property that a member expression reads, when written as a plain name or a string, and
 * `undefined` for anything else, including a private name such as `this.#innerHTML`.
 */
function getPropertyName( { computed, property } ) {
	if ( computed ) {
		return property.value;
	}

	return property.type === 'Identifier' ? property.name : undefined;
}

/**
 * Whether an expression, after unwrapping, is a call to a function with the given name.
 */
function isCallTo( node, name ) {
	const expression = unwrapExpression( node );

	return expression.type === 'CallExpression' && unwrapExpression( expression.callee ).name === name;
}

/**
 * Whether reading an expression twice gives the same value without side effects: a name, `this`, a literal, or a chain of
 * property reads made of them.
 */
function isSideEffectFree( node ) {
	const expression = unwrapExpression( node );

	switch ( expression.type ) {
		case 'Identifier':
		case 'ThisExpression':
		case 'Literal':
			return true;
		case 'TemplateLiteral':
			return expression.expressions.every( isSideEffectFree );
		case 'MemberExpression':
			return isSideEffectFree( expression.object ) && ( !expression.computed || isSideEffectFree( expression.property ) );
		default:
			return false;
	}
}

/**
 * Strips TypeScript wrapper nodes (`x as Element`, `x!`, `<Element>x`, `x satisfies Element`) and `ChainExpression`
 * wrappers down to the expression underneath, since none changes what is actually being accessed or called.
 */
function unwrapExpression( node ) {
	let expression = node;

	while ( EXPRESSION_WRAPPERS.has( expression.type ) ) {
		expression = expression.expression;
	}

	return expression;
}
