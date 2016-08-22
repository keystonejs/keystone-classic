// ==============================
// Inline Group: Section
// ==============================

// Takes only FormInput and Button as children, rendering them as a
// tidy inline array

import { borderLeftRadius, borderRightRadius } from '../../../utils/css';
import theme from '../../../theme';

module.exports = {
	// pull active elements up
	active: {
		position: 'relative',
	},

	// stretch to fill available width
	grow: {
		flex: '1 1 0',
	},

	// separate applicable non-contiguous elements
	separate: {
		paddingLeft: '0.75em',
	},

	// Contiguous: manipulate children directly

	// pull focused contiguous elements up
	contiguous: {
		':focus': {
			position: 'relative',
			zIndex: 1,
		},
	},

	// position
	contiguous__middle: {
		borderRadius: 0,
		marginLeft: theme.button.borderWidth * -1,
	},
	contiguous__first: {
		...borderRightRadius(0),
	},
	contiguous__last: {
		...borderLeftRadius(0),
		marginLeft: theme.button.borderWidth * -1,
	},
};
