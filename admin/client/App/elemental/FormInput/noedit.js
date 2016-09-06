import React, { Component, PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';

import theme from '../../../theme';

/* eslint quote-props: ["error", "as-needed"] */

function FormInputNoedit ({ className, component: Component, ...props }) {
	props.className = css(
		classes.noedit,
		className
	);

	return <Component {...props} />;
};

FormInputNoedit.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
};
FormInputNoedit.defaultProps = {
	component: 'span',
};

const classes = StyleSheet.create({
	noedit: {
		appearance: 'none',
		backgroundColor: theme.input.bgColor,
		backgroundImage: 'none',
		borderColor: theme.input.border.color,
		borderRadius: theme.input.border.radius,
		borderStyle: 'solid',
		borderWidth: theme.input.border.width,
		color: 'inherit', // FIXME
		display: 'block',
		height: theme.input.height,
		lineHeight: theme.input.lineHeight,
		padding: `0 ${theme.input.paddingHorizontal}`,
		transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
		width: '100%',

		':hover': {
			borderColor: theme.input.border.colorHover,
			outline: 0,
		},
		':focus': {
			borderColor: theme.input.border.colorFocus,
			boxShadow: theme.input.boxShadowFocus,
			outline: 0,
		},
	},
});

module.exports = FormInputNoedit;
