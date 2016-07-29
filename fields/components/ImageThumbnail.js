/* eslint quote-props: ["error", "as-needed"] */

import { StyleSheet, css } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import theme from '../../admin/client/theme';

function ImageThumbnail ({ component, className, ...props }) {
	const componentProps = {
		...props,
		className: `${css(classes.base)}${className ? className : ''}`,
	};

	return React.createElement(component, componentProps);
};

ImageThumbnail.propTypes = {
	component: PropTypes.oneOf(['a', 'button', 'div', 'span']),
};
ImageThumbnail.defaultProps = {
	component: 'span',
};

const hoverAndFocusStyles = {
	borderColor: theme.input.border.colorFocus,
	outline: 'none',
};
const classes = StyleSheet.create({
	base: {
		backgroundColor: 'white',
		borderRadius: theme.borderRadius.default,
		border: `1px solid ${theme.input.border.color}`,
		display: 'inline-block',
		height: 'auto',
		lineHeight: '1',
		maxWidth: '100%',
		padding: '4px',
		position: 'relative',

		':hover': hoverAndFocusStyles,
		':focus': {
			...hoverAndFocusStyles,
			boxShadow: theme.input.boxShadowFocus,
		},
	},
});

module.exports = ImageThumbnail;
