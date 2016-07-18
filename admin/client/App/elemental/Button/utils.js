//
// Button variants
// ==============================

import { gradientVertical } from '../utils';
import { blend, darken, fade, lighten } from '../../../utils/color';
import theme from '../../../theme';

// TODO: work out how to add missing combination classes
// - .hover
// - .focus
// - .active


// Fill

function buttonFillVariant (textColor, bgColor) {
	const activeStyles = {
		backgroundColor: darken(bgColor, 4),
		backgroundImage: 'none',
		borderColor: `${darken(bgColor, 15)} ${darken(bgColor, 10)} ${darken(bgColor, 5)}`,
		boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
	};

	const focusStyles = {
		...gradientVertical(lighten(bgColor, 10), bgColor),
		borderColor: `${bgColor} ${darken(bgColor, 5)} ${darken(bgColor, 10)}`,
		boxShadow: `0 0 0 3px ${fade(bgColor, 25)}`,
		color: textColor,
		outline: 'none',
	};

	return {
		...gradientVertical(lighten(bgColor, 5), darken(bgColor, 5), bgColor),
		'borderColor': `${darken(bgColor, 5)} ${darken(bgColor, 10)} ${darken(bgColor, 15)}`,
		'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
		'color': textColor,
		'fontWeight': 400,
		'textShadow': '0 -1px 0 rgba(0, 0, 0, 0.25)',

		':hover': {
			...gradientVertical(lighten(bgColor, 10), bgColor),
			borderColor: `${bgColor} ${darken(bgColor, 5)} ${darken(bgColor, 10)}`,
			boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
			color: textColor,
			outline: 'none',
		},

		':focus': focusStyles,
		'&.is-focus': focusStyles,

		':active': activeStyles,
		'&.is-active': activeStyles,
	};
}


// Default

function buttonDefaultVariant (textColor) {
	return {
		...gradientVertical('#fafafa', '#eaeaea'),
		'border': `1px solid ${theme.input.border.color}`,
		'borderColor': `${theme.input.border.color} ${darken(theme.input.border.color, 6)} ${darken(theme.input.border.color, 12)}`,
		'color': textColor,
		':hover': {
			...gradientVertical(lighten(textColor, 4), darken(textColor, 4)),
			borderColor: `${darken(textColor, 6)} ${darken(textColor, 12)} ${darken(textColor, 18)}`,
			boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
			color: 'white',
		},
		':focus': {
			borderColor: `${darken(textColor, 6)} ${darken(textColor, 12)} ${darken(textColor, 18)}`,
			boxShadow: `0 0 0 3px ${fade(textColor, 25)}`,
			color: 'white',
			outline: 'none',
		},
		':hover:focus': {
			color: 'white',
		},
		':active': {
			backgroundColor: darken(textColor, 4),
			backgroundImage: 'none',
			borderColor: `${darken(textColor, 18)} ${darken(textColor, 12)} ${darken(textColor, 6)}`,
			boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
			color: 'white',
		},

		'[disabled]': {
			backgroundColor: theme.button.default.disabled.bg,
		},
	};
}


// Hollow

function buttonHollowVariant (textColor, borderColor) {
	const focusAndHoverStyles = {
		backgroundImage: 'none',
		backgroundColor: blend(borderColor, theme.color.body, 8),
		borderColor: darken(borderColor, 10),
		color: textColor,
		outline: 'none',
	};
	const focusOnlyStyles = {
		boxShadow: `0 0 0 3px ${fade(borderColor, 10)}`,
	};

	return {
		'background': 'none',
		'borderColor': borderColor,
		'color': textColor,
		':hover': focusAndHoverStyles,
		':focus ': Object.assign(focusAndHoverStyles, focusOnlyStyles),
		'&.is-focus ': Object.assign(focusAndHoverStyles, focusOnlyStyles),
		':active': {
			backgroundColor: fade(borderColor, 20),
			borderColor: darken(borderColor, 20),
			boxShadow: 'none',
		},
	};
};


// Link

function buttonLinkVariant (textColor, hoverColor) {
	const baseStyles = {
		background: 'none',
		border: 0,
		boxShadow: 'none',
		outline: 'none',
	};
	const hoverAndFocusStyles = {
		...baseStyles,
		color: hoverColor,
		textDecoration: 'underline',
	};

	return {
		...baseStyles,
		'color': textColor,
		'fontWeight': 'normal',

		':active': baseStyles,
		'[disabled]': baseStyles,

		':hover': hoverAndFocusStyles,
		':focus': hoverAndFocusStyles,
	};
};

module.exports = {
	buttonDefaultVariant,
	buttonFillVariant,
	buttonHollowVariant,
	buttonLinkVariant,
};
