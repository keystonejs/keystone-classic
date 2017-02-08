// ==============================
// Alert
// ==============================

/* eslint quote-props: ["error", "as-needed"] */

import colors from './colors';
import theme from '../../../theme';

// Prepare variants
const colorVariants = {};
Object.keys(colors).forEach(color => {
	colorVariants[color] = {
		backgroundColor: colors[color].background,
		borderColor: colors[color].border,
		color: colors[color].text,
	};
});

// Prepare headings
const headingTagnames = {};
['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
	headingTagnames[tag] = { color: 'inherit' };
});

const linkStyles = {
	color: 'inherit',
	textDecoration: 'underline',

	':hover': { color: 'inherit' },
	':focus': { color: 'inherit' },
};

module.exports = {
	alert: {
		borderColor: 'transparent',
		borderRadius: theme.alert.borderRadius,
		borderStyle: 'solid',
		borderWidth: theme.alert.borderWidth,
		margin: theme.alert.margin,
		padding: theme.alert.padding,
	},

	// tagnames
	a: linkStyles,
	Link: linkStyles,
	strong: {
		fontWeight: 500,
	},

	// headings
	...headingTagnames,

	// colors
	...colorVariants,
};
