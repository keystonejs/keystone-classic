// ==============================
// Container
// ==============================

/* eslint quote-props: ["error", "as-needed"] */

import sizes from './sizes';
import theme from '../../../theme';

// Prepare sizes
const sizeVariants = {};
Object.keys(sizes).forEach(size => {
	sizeVariants[size] = {
		maxWidth: sizes[size],
	};
});

/*
	Micro clearfix hack
	1.	The space content is one way to avoid an Opera bug when the
			contenteditable attribute is included anywhere else in the document.
			Otherwise it causes space to appear at the top and bottom of elements
			that are clearfixed.
	2.	The use of `table` rather than `block` is only necessary if using
			`:before` to contain the top-margins of child elements.
*/
const clearfixStyles = {
	clear: 'both',
	content: '" "', // 1
	display: 'table', // 2
};

module.exports = {
	container: {
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: theme.container.gutter,
		paddingRight: theme.container.gutter,
	},

	// clear floating children
	clearfix: {
		':before': clearfixStyles,
		':after': clearfixStyles,
	},

	// sizes
	...sizeVariants,
};
