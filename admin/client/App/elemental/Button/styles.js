// ==============================
// Button
// ==============================

import { gradientVertical } from '../mixins';
import { darken, fade, lighten } from '../../../utils/color';
import theme from '../../../theme';
import {
	buttonFillVariant,
	buttonHollowVariant,
	buttonLinkVariant,
} from './mixins';

const baseHoverAndFocusStyles = {
	color: theme.button.default.textColor,
	textDecoration: 'none',
};
const defaultActiveStyles = {
	background: '#e6e6e6',
	borderColor: darken(theme.input.border.color, 10),
	boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
	color: theme.color.text,
};
const linkDeleteHoverAndFocusStyles = {
	...gradientVertical(lighten(theme.color.danger, 4), darken(theme.color.danger, 4)),
	backgroundColor: theme.color.danger,
	borderColor: `${darken(theme.color.danger, 4)} ${darken(theme.color.danger, 8)} ${darken(theme.color.danger, 12)}`,
	boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
	color: 'white',
	textDecoration: 'none',
};

module.exports = {
	button: {
		appearance: 'none',
		background: 'none',
		border: '1px solid transparent',
		borderRadius: theme.borderRadius.default,
		cursor: 'pointer',
		display: 'inline-block',
		fontWeight: theme.button.font.weight,
		height: theme.component.height,
		lineHeight: theme.component.lineHeight,
		marginBottom: 0,
		padding: `0 ${theme.button.paddingHorizontal}`,
		outline: 0,
		textAlign: 'center',
		touchAction: 'manipulation',
		userSelect: 'none',
		verticalAlign: 'middle',
		whiteSpace: 'nowrap',

		':hover': baseHoverAndFocusStyles,
		':focus': baseHoverAndFocusStyles,
		'&.is-focus': baseHoverAndFocusStyles,

		'[disabled]': {
			opacity: 0.4,
			pointerEvents: 'none',
		},
	},

	// Kinds
	// ------------------------------

	// special case for the default button
	kind__default: {
		...gradientVertical('#fafafa', '#eaeaea'),
		border: `1px solid ${theme.input.border.color}`,
		borderColor: `${theme.input.border.color} ${darken(theme.input.border.color, 6)} ${darken(theme.input.border.color, 12)}`,
		color: theme.color.text,
		textShadow: '0 1px 0 white',

		':hover': {
			...gradientVertical('#fff', '#eee'),
			borderColor: `${darken(theme.input.border.color, 5)} ${darken(theme.input.border.color, 5)} ${darken(theme.input.border.color, 10)}`,
			boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
			color: theme.color.text,
		},
		':focus': {
			borderColor: theme.color.primary,
			boxShadow: `0 0 0 3px ${fade(theme.color.primary, 10)}`,
			color: theme.color.text,
			outline: 'none',
		},
		':active': defaultActiveStyles,

		'[disabled]': {
			backgroundColor: theme.color.gray10,
		},
	},
	'kind__default__is-active': defaultActiveStyles,

	// fill styles
	kind__primary: buttonFillVariant('white', theme.button.primary.bgColor),
	kind__success: buttonFillVariant('white', theme.button.success.bgColor),
	kind__warning: buttonFillVariant('white', theme.button.warning.bgColor),
	kind__danger: buttonFillVariant('white', theme.button.danger.bgColor),

	// hollow styles
	'kind__hollow-primary': buttonHollowVariant(theme.button.primary.bgColor, theme.button.primary.borderColor),
	'kind__hollow-success': buttonHollowVariant(theme.button.success.bgColor, theme.button.success.borderColor),
	'kind__hollow-warning': buttonHollowVariant(theme.button.warning.bgColor, theme.button.warning.borderColor),
	'kind__hollow-danger': buttonHollowVariant(theme.button.danger.bgColor, theme.button.danger.borderColor),

	// link styles
	kind__link: buttonLinkVariant(theme.color.link, theme.color.linkHover),
	'kind__link-primary': buttonLinkVariant(theme.color.primary, theme.color.primary),
	'kind__link-success': buttonLinkVariant(theme.color.success, theme.color.success),
	'kind__link-warning': buttonLinkVariant(theme.color.warning, theme.color.warning),
	'kind__link-danger': buttonLinkVariant(theme.color.danger, theme.color.danger),
	'kind__link-cancel': buttonLinkVariant(theme.color.gray40, theme.color.danger),
	'kind__link-delete': {
		...buttonLinkVariant(theme.color.gray40, theme.color.danger),

		':hover': linkDeleteHoverAndFocusStyles,
		':focus': {
			...linkDeleteHoverAndFocusStyles,
			boxShadow: `0 0 0 3px ${fade(theme.color.danger, 25)}`,
		},
		':active': {
			backgroundColor: darken(theme.color.danger, 4),
			backgroundImage: 'none',
			borderColor: `${darken(theme.color.danger, 12)} ${darken(theme.color.danger, 8)} ${darken(theme.color.danger, 8)}`,
			boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
			color: 'white',
		},
	},

	// Sizes
	// ------------------------------

	size__large: { fontSize: theme.font.size.large },
	size__default: { fontSize: theme.font.size.default },
	size__small: { fontSize: theme.font.size.small },
	size__xsmall: {
		fontSize: theme.font.size.xsmall,
		lineHeight: '1.9',
		paddingLeft: '.66em',
		paddingRight: '.66em',
	},

	// Layout
	// ------------------------------

	layout__block: {
		display: 'block',
		paddingLeft: 0,
		paddingRight: 0,
		width: '100%',
	},
};


// Button Goups
// TODO: move this to the applicable component styles when have opportunity
// ------------------------------

// .ButtonGroup {
// 	display: inline-block;
// 	position: relative;
// 	vertical-align: middle;
//
// 	> .Button {
// 		border-radius: 0;
// 		float: left;
// 		margin-left: -1px;
//
// 		&:first-child {
// 			.border-left-radius(@border-radius-base);
// 			margin-left: 0;
// 		}
// 		&:last-child {
// 			.border-right-radius(@border-radius-base);
// 		}
// 		&:hover,
// 		&:active,
// 		&:focus {
// 			position: relative;
// 		}
// 		// fix bug where adjacent siblings overlap on hover
// 		&:focus {
// 			z-index: 1;
// 		}
// 	}
// }
