/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	rules: {
		'no-relative-imports': require( './rules/no-relative-imports' ),
		'ckeditor-error-message': require( './rules/ckeditor-error-message' ),
		'ckeditor-plugin-flags': require( './rules/ckeditor-plugin-flags.js' ),
		'enforce-node-protocol': require( './rules/enforce-node-protocol' ),
		'no-cross-package-imports': require( './rules/no-cross-package-imports' ),
		'no-default-export': require( './rules/no-default-export' ),
		'no-scoped-imports-within-package': require( './rules/no-scoped-imports-within-package' ),
		'license-header': require( './rules/license-header' ),
		'use-require-for-debug-mode-imports': require( './rules/use-require-for-debug-mode-imports' ),
		'non-public-members-as-internal': require( './rules/non-public-members-as-internal' ),
		'no-istanbul-in-debug-code': require( './rules/no-istanbul-in-debug-code' ),
		'allow-declare-module-only-in-augmentation-file': require( './rules/allow-declare-module-only-in-augmentation-file' ),
		'allow-imports-only-from-main-package-entry-point': require( './rules/allow-imports-only-from-main-package-entry-point.js' ),
		'allow-svg-imports-only-in-icons-package': require( './rules/allow-svg-imports-only-in-icons-package.js' ),
		'prevent-license-key-leak': require( './rules/prevent-license-key-leak' ),
		'require-as-const-returns-in-methods': require( './rules/require-as-const-returns-in-methods' ),
		'require-file-extensions-in-imports': require( './rules/require-file-extensions-in-imports' ),
		'validate-changelog-entry': require( './rules/validate-changelog-entry' )
	}
};
