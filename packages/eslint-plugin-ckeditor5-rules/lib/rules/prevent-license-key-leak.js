/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const ALLOWED = [
	'<YOUR_LICENSE_KEY>',
	'GPL'
];

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Prevent leaking of the license keys',
			category: 'CKEditor5'
		},
		fixable: 'code',
		messages: {
			licenseKeyLeak: `This code contains a license key. Replace it with the "${ ALLOWED[ 0 ] }" string.`
		}
	},
	create( context ) {
		return {
			ObjectExpression( node ) {
				const property = node.properties.find( property => {
					return property.type === 'Property' &&
						property.key.name === 'licenseKey' &&
						property.value.type === 'Literal' &&
						!ALLOWED.includes( property.value.value );
				} );

				if ( !property ) {
					return;
				}

				const quote = property.value.raw[ 0 ];

				context.report( {
					node: property,
					messageId: 'licenseKeyLeak',
					fix: fixer => fixer.replaceText( property.value, quote + ALLOWED[ 0 ] + quote )
				} );
			}
		};
	}
};
