/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

// Methods whose API silently falls back to `$root` when the caller omits the schema/element-name argument.
//
// Each entry encodes:
// - `method`           — the property name being called (used as the AST CallExpression callee filter).
// - `matchReceiver`    — predicate that decides whether the call site's receiver matches the model-side variant
//                        (e.g. `data.parse()` not `JSON.parse()`; `model.document.createRoot()` not a stray `*.createRoot()`).
// - `isMissingContext` — predicate over the call's arguments. True when the schema/element-name argument is omitted.
// - `label`            — short call shape used in the user-facing message.
const RULES = [
	{
		method: 'parse',
		matchReceiver: node => matchIdentifierReceiver( node, 'data' ),
		isMissingContext: args => args.length === 1,
		label: 'data.parse()'
	},
	{
		method: 'toModel',
		matchReceiver: node => matchIdentifierReceiver( node, 'data' ),
		isMissingContext: args => args.length === 1,
		label: 'data.toModel()'
	},
	{
		method: 'createRoot',
		matchReceiver: node => matchIdentifierReceiver( node, 'document' ),
		isMissingContext: args => args.length === 0,
		label: 'document.createRoot()'
	},
	{
		method: 'addRoot',
		matchReceiver: matchWriterReceiver,
		isMissingContext: args => args.length === 1,
		label: 'writer.addRoot()'
	},
	{
		// `upcastDispatcher.convert( viewElementOrFragment, writer, context = [ '$root' ] )` — third arg is the schema context.
		method: 'convert',
		matchReceiver: node => matchIdentifierReceiver( node, 'upcastDispatcher' ),
		isMissingContext: args => args.length === 2,
		label: 'upcastDispatcher.convert()'
	}
];

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Require an explicit root element name / schema context when calling APIs that silently fall back to "$root".',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			missingContext:
				'Pass the root element name explicitly to "{{ label }}". Without it the API falls back to "$root", ' +
				'which is silently wrong when "config.root.modelElement" is customised. ' +
				'If you have verified that the default is acceptable here, opt out with an ' +
				'"// eslint-disable-next-line" comment that explains why.'
		}
	},

	create( context ) {
		return {
			CallExpression( node ) {
				const callee = node.callee;

				if ( !callee || callee.type !== 'MemberExpression' || callee.computed ) {
					return;
				}

				if ( callee.property.type !== 'Identifier' ) {
					return;
				}

				const rule = RULES.find( r => r.method === callee.property.name );

				if ( !rule ) {
					return;
				}

				if ( !rule.matchReceiver( callee.object ) ) {
					return;
				}

				if ( !rule.isMissingContext( node.arguments ) ) {
					return;
				}

				context.report( {
					node,
					messageId: 'missingContext',
					data: { label: rule.label }
				} );
			}
		};
	}
};

/**
 * Matches a receiver whose final accessed property name (or bare identifier name) is `expectedName`. Covers both
 * member-access chains (`editor.data`, `this.model.document`, `editor.data.upcastDispatcher`) and destructured /
 * aliased identifiers (`const { data } = editor; data.parse(...)`).
 */
function matchIdentifierReceiver( node, expectedName ) {
	if ( !node ) {
		return false;
	}

	if ( node.type === 'Identifier' && node.name === expectedName ) {
		return true;
	}

	return node.type === 'MemberExpression' &&
		!node.computed &&
		node.property.type === 'Identifier' &&
		node.property.name === expectedName;
}

/**
 * Matches a receiver named `writer` (i.e. a `ModelWriter` from `model.change( writer => … )` or `model.enqueueChange`).
 * Stricter than `matchIdentifierReceiver` — only a bare `writer` identifier qualifies, never `*.writer` chains.
 * This excludes `MultiRootEditor#addRoot( rootName, options? )`, whose receiver is `editor` / `this` and which has
 * a different signature (options object as the second arg, with the model element name resolved internally).
 */
function matchWriterReceiver( node ) {
	return Boolean( node ) && node.type === 'Identifier' && node.name === 'writer';
}
