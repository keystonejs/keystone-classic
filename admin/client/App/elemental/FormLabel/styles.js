// ==============================
// Form Label
// ==============================

import { theme } from '../../../site';

module.exports = {
	'FormLabel': {
		color: theme.form.label.color,
		fontSize: theme.form.label.fontSize,
		fontWeight: theme.font.weight.bold,
		display: 'inline-block',
		marginBottom: theme.spacing.small,
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
