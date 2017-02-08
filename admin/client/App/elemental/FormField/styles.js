// ==============================
// Form Field
// ==============================

import theme from '../../../theme';

module.exports = {
	'FormField': {
		marginBottom: '1em',
		position: 'relative',
	},

	// when inside a horizontal form

	'FormField--form-layout-horizontal': {
		[`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
			display: 'table',
			tableLayout: 'fixed',
			width: '100%',
		},
	},

	// inside horizontal form
	// typically for use with submit button inside
	'FormField--offset-absent-label': {
		paddingLeft: theme.form.label.width,
	},

	// when inside an inline form

	'FormField--form-layout-inline': {
		'display': 'inline-block',
		'paddingLeft': '0.25em',
		'paddingRight': '0.25em',
		'verticalAlign': 'top',

		':first-child': { paddingLeft: 0 },
		':last-child': { paddingRight: 0 },
	},
};
