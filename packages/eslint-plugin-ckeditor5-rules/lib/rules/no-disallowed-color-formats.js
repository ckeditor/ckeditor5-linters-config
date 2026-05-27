/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

// CSS <named-color> keywords from CSS Color Module Level 4. The `transparent`
// and `currentcolor` keywords are intentionally not included - they are not
// concrete color names but special-purpose keywords.
const NAMED_COLORS = new Set( [
	'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown',
	'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan',
	'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid',
	'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink',
	'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite',
	'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
	'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen',
	'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue',
	'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
	'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
	'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
	'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
	'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver',
	'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise',
	'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
] );

// Matches a word that is not preceded or followed by a word character or hyphen.
// Designed to skip identifiers inside `var(--name-with-color-token)`.
const IDENTIFIER_TOKEN = /(?<![\w-])[a-z]+(?![\w-])/g;

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow hex, rgb()/rgba() and named CSS colors in declaration values. Use HSL or CSS custom properties instead.',
			category: 'CKEditor5'
		},
		schema: [],
		messages: {
			disallowedHex: 'Hex colors are not allowed. Use HSL or a CSS custom property instead.',
			disallowedRgb: 'rgb()/rgba() is not allowed. Use HSL or a CSS custom property instead.',
			disallowedNamedColor: 'Named CSS colors are not allowed. Use HSL or a CSS custom property instead.'
		}
	},

	create( context ) {
		const sourceCode = context.sourceCode;

		return {
			'Rule > Block Declaration'( node ) {
				const valueText = sourceCode.getText( node.value );

				if ( valueText.includes( '#' ) ) {
					context.report( {
						node: node.value,
						messageId: 'disallowedHex'
					} );
				}

				if ( valueText.includes( 'rgb' ) ) {
					context.report( {
						node: node.value,
						messageId: 'disallowedRgb'
					} );
				}

				if ( containsNamedColor( valueText ) ) {
					context.report( {
						node: node.value,
						messageId: 'disallowedNamedColor'
					} );
				}
			}
		};
	}
};

function containsNamedColor( valueText ) {
	const tokens = valueText.toLowerCase().match( IDENTIFIER_TOKEN );

	if ( !tokens ) {
		return false;
	}

	return tokens.some( token => NAMED_COLORS.has( token ) );
}
