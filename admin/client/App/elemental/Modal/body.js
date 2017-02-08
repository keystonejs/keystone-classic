import React from 'react';
import { css } from 'glamor';
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

const classes = {
	body: {
		paddingBottom: theme.modal.padding.body.vertical,
		paddingLeft: theme.modal.padding.body.horizontal,
		paddingRight: theme.modal.padding.body.horizontal,
		paddingTop: theme.modal.padding.body.vertical,
	},
};

module.exports = ModalBody;
