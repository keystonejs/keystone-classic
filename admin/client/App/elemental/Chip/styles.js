// ==============================
// Alert
// ==============================

/* eslint quote-props: ["error", "as-needed"] */

import colors from './colors';
import theme from '../../../theme';
import { borderLeftRadius, borderRightRadius } from '../../../utils/css';

// Prepare variants
const colorVariants = {};
Object.keys(colors).forEach(color => {
	const hoverStyles = {
		backgroundColor: colors[color].backgroundHover,
	};

	colorVariants['button__' + color] = {
		backgroundColor: colors[color].background,
		color: colors[color].text,

		':hover': hoverStyles,
		':focus': hoverStyles,
		':active': {
			backgroundColor: colors[color].backgroundActive,
		},
	};
});

module.exports = {
	chip: {
		display: 'inline-block',
		fontSize: theme.font.size.small,
		fontWeight: 500,
		marginRight: '0.5em',
		overflow: 'hidden',
		lineHeight: '2.2em',
	},

	// tagnames
	button: {
		appearance: 'none',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		display: 'block',
		float: 'left',
		padding: '0 .9em',
		outline: 'none',

		// make pills - exaggerate the padding toward the radii so it looks even
		':first-child': {
			...borderLeftRadius('3em'),
			paddingLeft: '1.1em',
		},
		':last-child': {
			...borderRightRadius('3em'),
			paddingRight: '1.1em',
		},
	},


	// provide separation between the label and clear buttons
	// floating stops the margins from collapsing into eaching

	label: { marginRight: 1 },
	clear: { marginLeft: 1 },

	// colors
	...colorVariants,
};
