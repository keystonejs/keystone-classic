// ==============================
// Form Input
// ==============================

import { theme } from '../../../site';

module.exports = {
	FormInput: {
		appearance: 'none',
		backgroundColor: theme.input.bgColor,
		backgroundImage: 'none',
		border: `1px solid ${theme.input.border.color}`,
		borderRadius: '0.25em', // FIXME
		boxShadow: theme.input.boxShadow,
		color: 'inherit', // FIXME
		display: 'block',
		height: theme.input.height,
		lineHeight: theme.input.lineHeight,
		padding: `0 ${theme.input.paddingHorizontal}`,
		transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
		width: '100%',

		':hover': {
			borderColor: theme.input.border.colorHover,
			outline: 0,
		},
		':focus': {
			borderColor: theme.input.border.colorFocus,
			boxShadow: theme.input.boxShadowFocus,
			outline: 0,
		},
	},
	'FormInput--disabled': {
		backgroundColor: theme.input.bgDisabled,
		pointerEvents: 'none',
	},
};
