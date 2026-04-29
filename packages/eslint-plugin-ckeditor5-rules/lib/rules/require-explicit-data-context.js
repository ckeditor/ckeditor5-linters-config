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
		matchReceiver: matchDataReceiver,
		isMissingContext: args => args.length === 1,
		label: 'data.parse()'
	},
	{
		method: 'toModel',
		matchReceiver: matchDataReceiver,
		isMissingContext: args => args.length === 1,
		label: 'data.toModel()'
	},
	{
		method: 'createRoot',
		matchReceiver: matchDocumentReceiver,
		isMissingContext: args => args.length === 0,
		label: 'document.createRoot()'
	},
	{
		method: 'addRoot',
		matchReceiver: matchWriterReceiver,
		isMissingContext: args => args.length === 1,
		label: 'writer.addRoot()'
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
 * Matches `data`, `editor.data`, `this.data`, `foo.bar.data`, etc. — i.e. any reference whose final accessed property
 * is `data`, plus a bare `data` identifier (covers destructured `const { data } = editor` patterns).
 */
function matchDataReceiver( node ) {
	if ( !node ) {
		return false;
	}

	if ( node.type === 'Identifier' && node.name === 'data' ) {
		return true;
	}

	return node.type === 'MemberExpression' &&
		!node.computed &&
		node.property.type === 'Identifier' &&
		node.property.name === 'data';
}

/**
 * Matches a receiver whose final accessed property is `document` (e.g. `editor.model.document`, `this.model.document`).
 * The model document is the only `document` in the engine that exposes `createRoot()`, so this filter is enough to
 * exclude unrelated `*.createRoot()` calls without false positives.
 */
function matchDocumentReceiver( node ) {
	if ( !node ) {
		return false;
	}

	if ( node.type === 'Identifier' && node.name === 'document' ) {
		return true;
	}

	return node.type === 'MemberExpression' &&
		!node.computed &&
		node.property.type === 'Identifier' &&
		node.property.name === 'document';
}

/**
 * Matches a receiver named `writer` (i.e. a `ModelWriter` from `model.change( writer => … )` or `model.enqueueChange`).
 * Crucially this excludes `MultiRootEditor#addRoot( rootName, options? )` — that public API has a different
 * second-arg shape (options object) and resolves the model element name internally, so it must not be flagged.
 */
function matchWriterReceiver( node ) {
	return Boolean( node ) && node.type === 'Identifier' && node.name === 'writer';
}
