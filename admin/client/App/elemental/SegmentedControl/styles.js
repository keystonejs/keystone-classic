// ==============================
// Segmented Control
// ==============================

/* eslint quote-props: ["error", "as-needed"] */

import colors from './colors';
import theme from '../../../theme';

// Prepare variants
const colorVariants = {};
Object.keys(colors).forEach(color => {
	const hoverStyles = {
		backgroundColor: colors[color],
		color: 'white',
	};
	colorVariants['button__' + color] = {
		backgroundColor: colors[color],
		color: 'white',

		':hover': hoverStyles,
		':focus': hoverStyles,
	};
});

module.exports = {
	control: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.input.border.color.default,
		borderRadius: '0.4em',
		display: 'flex',
		fontSize: theme.font.size.small,
		paddingLeft: 1,
		paddingRight: 1,
	},
	control__inline: {
		display: 'inline-flex',
	},

	// buttons
	button: {
		background: 'none',
		border: 0,
		borderRadius: '0.25em',
		flexGrow: 1,
		margin: '2px 1px',
		padding: '0.3em 0.9em',
		outline: 0,

		':hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
		':focus': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
	},
	button__equalWidth: {
		flex: '1 1 0',
	},
	button__cropText: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	button__disabled: {
		opacity: 0.6,
		pointerEvents: 'none',
	},

	// colors
	...colorVariants,
};
