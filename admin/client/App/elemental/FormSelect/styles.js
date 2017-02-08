// ==============================
// Form Select
// ==============================

/* eslint quote-props: ["error", "as-needed"] */

import theme from '../../../theme';
import { darken, lighten } from '../../../utils/color';

module.exports = {
	container: {
		position: 'relative',
	},

	// select node
	select: {
		appearance: 'none',
		backgroundColor: theme.input.background.default,
		backgroundImage: 'none',
		borderColor: theme.input.border.color.default,
		borderBottomColor: darken(theme.input.border.color.default, 4),
		borderTopColor: lighten(theme.input.border.color.default, 4),
		borderRadius: theme.input.border.radius,
		borderStyle: 'solid',
		borderWidth: theme.input.border.width,
		boxShadow: theme.select.boxShadow,
		color: 'inherit', // FIXME
		display: 'block',
		height: theme.input.height,
		lineHeight: theme.input.lineHeight,
		padding: `0 ${theme.input.paddingHorizontal}`,
		transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
		width: '100%',

		':hover': {
			borderColor: theme.input.border.color.hover,
			outline: 0,
		},
		':focus': {
			borderColor: theme.input.border.color.focus,
			boxShadow: theme.input.boxShadowFocus,
			outline: 0,
		},
	},
	'select--disabled': {
		backgroundColor: theme.input.background.disabled,
		pointerEvents: 'none',
	},

	// arrows
	arrows: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: theme.input.height,
		justifyContent: 'center',
		pointerEvents: 'none',
		position: 'absolute',
		right: 0,
		top: 0,
		width: theme.input.height,
	},
	arrow: {
		borderLeft: '0.3em solid transparent',
		borderRight: '0.3em solid transparent',
		display: 'inline-block',
		height: 0,
		verticalAlign: 'middle',
		width: 0,
		zIndex: 1,
	},
	arrowTop: {
		borderBottom: '0.3em solid',
		marginBottom: '0.1em',
	},
	arrowBottom: {
		borderTop: '0.3em solid',
		marginTop: '0.1em',
	},
};
