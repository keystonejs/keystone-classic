// ==============================
// Inline Group
// ==============================

// Takes only FormInput and Button as children, rendering them as a
// tidy inline array

import { borderLeftRadius, borderRightRadius } from '../../../utils/css';
import theme from '../../../theme';

module.exports = {
	group: {
		display: 'inline-block',
		verticalAlign: 'middle',
	},

	// buttons
	default: {
		':focus': {
			position: 'relative',
			zIndex: 1,
		},
	},
	middle: {
		borderRadius: 0,
		marginLeft: theme.button.borderWidth * -1,
	},
	first: {
		...borderRightRadius(0),
	},
	last: {
		...borderLeftRadius(0),
		marginLeft: theme.button.borderWidth * -1,
	},
	active: {
		position: 'relative',
	},
};
