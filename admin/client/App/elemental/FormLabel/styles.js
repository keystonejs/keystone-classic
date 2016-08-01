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
		display: 'table-cell',
		lineHeight: theme.component.lineHeight, // fix
		marginBottom: 0,
		verticalAlign: 'text-top',
		width: theme.form.label.width,
	},
};
