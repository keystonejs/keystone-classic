// ==============================
// Button
// ==============================

import { gradientVertical } from '../../../utils/css';
import { darken, fade, lighten } from '../../../utils/color';
import theme from '../../../theme';


// Common Styles
// ----------------

exports.common = {
	// Base Button
	// ----------------
	base: {
		'appearance': 'none',
		'background': 'none',
		'borderWidth': theme.button.borderWidth,
		'borderStyle': 'solid',
		'borderColor': 'transparent',
		'borderRadius': theme.button.borderRadius,
		'cursor': 'pointer',
		'display': 'inline-block',
		'fontWeight': theme.button.font.weight,
		'height': theme.component.height,
		'lineHeight': theme.component.lineHeight,
		'marginBottom': 0,
		'padding': `0 ${theme.button.paddingHorizontal}`,
		'outline': 0,
		'textAlign': 'center',
		'touchAction': 'manipulation',
		'userSelect': 'none',
		'verticalAlign': 'middle',
		'whiteSpace': 'nowrap',

		':hover': {
			color: theme.button.default.textColor,
			textDecoration: 'none',
		},
		':focus': {
			color: theme.button.default.textColor,
			textDecoration: 'none',
		},
	},
	// Block Display
	// ----------------
	block: {
		display: 'block',
		width: '100%',
	},
	// Disabled
	// ----------------
	disabled: {
		opacity: 0.4,
		pointerEvents: 'none',
	},
	// Sizes
	// ----------------
	large: {
		fontSize: theme.font.size.large,
	},
	default: {
		fontSize: theme.font.size.default,
	},
	small: {
		fontSize: theme.font.size.small,
	},
	xsmall: {
		fontSize: theme.font.size.xsmall,
		lineHeight: '1.9',
		paddingLeft: '.66em',
		paddingRight: '.66em',
	},
};


// Fill Variant
// ----------------
function buttonFillVariant (textColor, bgColor) {
	const hoverStyles = {
		...gradientVertical(lighten(bgColor, 10), darken(bgColor, 5)),
		borderColor: `${darken(bgColor, 5)} ${darken(bgColor, 10)} ${darken(bgColor, 15)}`,
		boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
		color: textColor,
		outline: 'none',
	};
	const focusStyles = {
		...gradientVertical(lighten(bgColor, 10), darken(bgColor, 5)),
		borderColor: `${darken(bgColor, 5)} ${darken(bgColor, 10)} ${darken(bgColor, 15)}`,
		boxShadow: `0 0 0 3px ${fade(bgColor, 25)}`,
		color: textColor,
		outline: 'none',
	};
	const activeStyles = {
		backgroundColor: darken(bgColor, 10),
		backgroundImage: 'none',
		borderColor: `${darken(bgColor, 25)} ${darken(bgColor, 15)} ${darken(bgColor, 10)}`,
		boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
	};
	return {
		base: {
			...gradientVertical(lighten(bgColor, 5), darken(bgColor, 10), bgColor),
			'borderColor': `${darken(bgColor, 10)} ${darken(bgColor, 20)} ${darken(bgColor, 25)}`,
			'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
			'color': textColor,
			'fontWeight': 400,
			'textShadow': '0 -1px 0 rgba(0, 0, 0, 0.25)',

			':hover': hoverStyles,
			':focus': focusStyles,
			':active': activeStyles,
		},
		active: activeStyles,
	};
}
// TODO: This is pretty hacky, needs to be consolidated with the Variant() method
// above (needs more theme variables to be implemented though)
function buttonFillDefault () {
	const borderColor = theme.input.border.color.default;
	const hoverStyles = {
		...gradientVertical('#fff', '#eee'),
		borderColor: `${darken(borderColor, 5)} ${darken(borderColor, 5)} ${darken(borderColor, 10)}`,
		boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
		color: theme.color.text,
	};
	const focusStyles = {
		borderColor: theme.color.primary,
		boxShadow: `0 0 0 3px ${fade(theme.color.primary, 10)}`,
		color: theme.color.text,
		outline: 'none',
	};
	const activeStyles = {
		background: '#e6e6e6',
		borderColor: darken(borderColor, 10),
		boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
		color: theme.color.text,
	};
	return {
		base: {
			...gradientVertical('#fafafa', '#eaeaea'),
			'borderColor': `${borderColor} ${darken(borderColor, 6)} ${darken(borderColor, 12)}`,
			'color': theme.color.text,
			'textShadow': '0 1px 0 white',

			':hover': hoverStyles,
			':focus': focusStyles,
			':active': activeStyles,
		},

		// gross hack
		active: {
			...activeStyles,

			':hover': activeStyles,
			':focus': {
				...activeStyles,
				...focusStyles,
				boxShadow: `0 0 0 3px ${fade(theme.color.primary, 10)}, inset 0 1px 2px rgba(0, 0, 0, 0.1)`,
			},
			':active': activeStyles,
		},
	};
}
exports.fill = (color) => {
	switch (color) {
		case 'default':
			return buttonFillDefault();
		case 'cancel':
		case 'delete':
			return buttonFillVariant('white', theme.button.danger.bgColor);
		default:
			return buttonFillVariant('white', theme.button[color].bgColor);
	}
};


// Hollow Variant
// ----------------
function buttonHollowVariant (textColor, borderColor) {
	const focusAndHoverStyles = {
		backgroundImage: 'none',
		backgroundColor: fade(borderColor, 15),
		borderColor: darken(borderColor, 15),
		boxShadow: 'none',
		color: textColor,
		outline: 'none',
	};
	const focusOnlyStyles = {
		boxShadow: `0 0 0 3px ${fade(borderColor, 10)}`,
	};
	const activeStyles = {
		backgroundColor: fade(borderColor, 35),
		borderColor: darken(borderColor, 25),
		boxShadow: 'none',
	};

	return {
		base: {
			'background': 'none',
			'borderColor': borderColor,
			'color': textColor,

			':hover': focusAndHoverStyles,
			':focus ': Object.assign({}, focusAndHoverStyles, focusOnlyStyles),
			':active': activeStyles,
		},
		active: activeStyles,
	};
};
exports.hollow = (color) => {
	// TODO: better handling of cancel and delete colors
	if (color === 'cancel' || color === 'delete') color = 'danger';

	return buttonHollowVariant(theme.button[color].bgColor, theme.button[color].borderColor);
};


// Link Variant
// ----------------
function buttonLinkVariant (textColor, hoverColor) {
	const hoverStyles = {
		color: hoverColor,
		textDecoration: 'underline',
	};
	return {
		base: {
			'background': 'none',
			'border': 0,
			'boxShadow': 'none',
			'color': textColor,
			'fontWeight': 'normal',
			'outline': 'none',

			':hover': hoverStyles,
			':focus': hoverStyles,
			':active': hoverStyles,
		},
		active: hoverStyles,
	};
};
function buttonLinkDelete () {
	const styles = buttonLinkVariant(theme.color.gray40, theme.color.danger);
	const hoverStyles = {
		...gradientVertical(lighten(theme.color.danger, 10), darken(theme.color.danger, 10)),
		backgroundColor: theme.color.danger,
		borderColor: `${darken(theme.color.danger, 4)} ${darken(theme.color.danger, 8)} ${darken(theme.color.danger, 12)}`,
		boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
		color: 'white',
		textDecoration: 'none',
	};
	const activeStyles = {
		backgroundColor: darken(theme.color.danger, 4),
		backgroundImage: 'none',
		borderColor: `${darken(theme.color.danger, 12)} ${darken(theme.color.danger, 8)} ${darken(theme.color.danger, 8)}`,
		boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
		color: 'white',
	};
	return {
		base: {
			...styles.base,
			':hover': hoverStyles,
			':focus': hoverStyles,
			':active': activeStyles,
		},
		active: activeStyles,
	};
}

exports.link = (color) => {
	switch (color) {
		case 'default':
			return buttonLinkVariant(theme.color.link, theme.color.linkHover);
		case 'cancel':
			return buttonLinkVariant(theme.color.gray40, theme.color.danger);
		case 'delete':
			return buttonLinkDelete();
		default:
			return buttonLinkVariant(theme.color[color], theme.color[color]);
	}
};
