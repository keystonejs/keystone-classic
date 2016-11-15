import React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import theme from '../../../theme';

function ModalBody ({
	className,
	...props
}) {
	return (
		<div
			className={css(classes.body, className)}
			{...props}
		/>
	);
};

const classes = StyleSheet.create({
	body: {
		paddingBottom: theme.modal.padding.body.vertical,
		paddingLeft: theme.modal.padding.body.horizontal,
		paddingRight: theme.modal.padding.body.horizontal,
		paddingTop: theme.modal.padding.body.vertical,
	},
});

module.exports = ModalBody;
