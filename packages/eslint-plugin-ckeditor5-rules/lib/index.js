/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	rules: {
		'allow-css-imports-only-in-main-package-entry-point': require( './rules/allow-css-imports-only-in-main-package-entry-point.js' ),
		'allow-declare-module-only-in-augmentation-file': require( './rules/allow-declare-module-only-in-augmentation-file' ),
		'allow-imports-only-from-main-package-entry-point': require( './rules/allow-imports-only-from-main-package-entry-point.js' ),
		'allow-svg-imports-only-in-icons-package': require( './rules/allow-svg-imports-only-in-icons-package.js' ),
		'ck-content-variable-name': require( './rules/ck-content-variable-name' ),
		'ckeditor-error-message': require( './rules/ckeditor-error-message' ),
		'ckeditor-plugin-flags': require( './rules/ckeditor-plugin-flags.js' ),
		'content-styles-in-index-content': require( './rules/content-styles-in-index-content' ),
		'css-indent': require( './rules/css-indent' ),
		'enforce-node-protocol': require( './rules/enforce-node-protocol' ),
		'license-header': require( './rules/license-header' ),
		'no-cross-package-imports': require( './rules/no-cross-package-imports' ),
		'no-default-export': require( './rules/no-default-export' ),
		'no-disallowed-color-formats': require( './rules/no-disallowed-color-formats' ),
		'no-editor-styles-in-index-content': require( './rules/no-editor-styles-in-index-content' ),
		'no-enum': require( './rules/no-enum' ),
		'no-istanbul-in-debug-code': require( './rules/no-istanbul-in-debug-code' ),
		'no-literal-dollar-root': require( './rules/no-literal-dollar-root' ),
		'no-relative-imports': require( './rules/no-relative-imports' ),
		'no-scoped-imports-within-package': require( './rules/no-scoped-imports-within-package' ),
		'non-public-members-as-internal': require( './rules/non-public-members-as-internal' ),
		'prevent-license-key-leak': require( './rules/prevent-license-key-leak' ),
		'require-as-const-returns-in-methods': require( './rules/require-as-const-returns-in-methods' ),
		'require-explicit-data-context': require( './rules/require-explicit-data-context' ),
		'require-file-extensions-in-imports': require( './rules/require-file-extensions-in-imports' ),
		'validate-changelog-entry': require( './rules/validate-changelog-entry' ),
		'validate-module-tag': require( './rules/validate-module-tag' )
	}
};
