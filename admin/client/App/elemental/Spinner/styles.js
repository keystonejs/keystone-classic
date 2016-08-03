// ==============================
// Spinner
// ==============================

import theme from '../../../theme';
import colors from './colors';
import sizes from './sizes';

// Prepare variants
const colorVariants = {};
colors.forEach(color => {
	colorVariants[`color__${color}`] = {
		backgroundColor: theme.spinner.color[color],
	};
});

// Prepare sizes
const sizeVariants = {};
sizes.forEach(size => {
	sizeVariants[`size__${size}`] = {
		fontSize: theme.spinner.size[size],
	};
});

// Declare animation keyframes
const pulse = {
	'0%, 80%, 100%': { opacity: 0 },
	'40%': { opacity: 1 },
};

module.exports = {
	base: {
		display: 'inline-block',
		lineHeight: 1,
		textAlign: 'center',
		verticalAlign: 'middle',
		width: '5em',
	},
	small:	{ fontSize: 4 },
	medium:	{ fontSize: 8 },
	large:	{ fontSize: 16 },

	// text
	text: {
		border: 0,
		clip: 'rect(0,0,0,0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		width: 1,
	},

	// dots
	dot: {
		animationName: pulse,
		animationDuration: '1s',
		animationIterationCount: 'infinite',
		borderRadius: '1em',
		display: 'inline-block',
		height: '1em',
		verticalAlign: 'top',
		width: '1em',
	},
	dot__second: {
		animationDelay: '160ms',
		marginLeft: '1em',
	},
	dot__third: {
		animationDelay: '320ms',
		marginLeft: '1em',
	},

	// Colors
	...colorVariants,

	// Sizes
	...sizeVariants,
};
