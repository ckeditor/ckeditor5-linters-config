/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	rules: {
		'no-relative-imports': require( './rules/no-relative-imports' ),
		'ckeditor-error-message': require( './rules/ckeditor-error-message' ),
		'ckeditor-imports': require( './rules/ckeditor-imports' ),
		'no-cross-package-imports': require( './rules/no-cross-package-imports' ),
		'license-header': require( './rules/license-header' ),
		'use-require-for-debug-mode-imports': require( './rules/use-require-for-debug-mode-imports' ),
		'non-public-members-as-internal': require( './rules/non-public-members-as-internal' ),
		'no-build-extensions': require( './rules/no-build-extensions' )
	}
};
