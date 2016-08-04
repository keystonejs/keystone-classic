import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { FormField, FormLabel } from 'elemental';
import theme from '../../admin/client/theme';

function NestedFormField ({ children, className, label, ...props }) {
	return (
		<FormField {...props}>
			<FormLabel className={css(classes.label)}>{label}</FormLabel>
			{children}
		</FormField>
	);
};
const classes = StyleSheet.create({
	label: {
		color: theme.color.gray40,
		fontSize: theme.font.size.small,
		paddingLeft: '1em',
	},
});

module.exports = NestedFormField;
