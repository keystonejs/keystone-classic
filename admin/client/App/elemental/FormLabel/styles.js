// ==============================
// Form Label
// ==============================

import theme from '../../../theme';

module.exports = {
	'FormLabel': {
		color: theme.form.label.color,
		fontSize: theme.form.label.fontSize,
		fontWeight: theme.form.label.fontWeight,
		display: 'inline-block',
		marginBottom: '0.5em',
	},

	// when inside a horizontal form

	'FormLabel--form-layout-horizontal': {
		[`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
			display: 'table-cell',
			lineHeight: theme.component.lineHeight, // fix
			marginBottom: 0,
			paddingRight: 5,
			verticalAlign: 'top',
			width: theme.form.label.width,
		},
	},

	// crop long text

	'FormLabel--crop-text': {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
};
