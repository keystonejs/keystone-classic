import { StyleSheet, css } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

function FormLabel (
	{ className, component: Component, cropText, htmlFor, ...props },
	{ formFieldId, formLayout, labelWidth }
) {
	props.htmlFor = htmlFor || formFieldId;
	props.className = css(
		classes.FormLabel,
		formLayout ? classes['FormLabel--form-layout-' + formLayout] : null,
		cropText ? classes['FormLabel--crop-text'] : null,
		className
	);
	if (labelWidth) {
		props.style = {
			width: labelWidth,
			...props.style,
		};
	}

	return <Component {...props} />;
};


FormLabel.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
	labelWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};
FormLabel.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	cropText: PropTypes.bool,
};
FormLabel.defaultProps = {
	component: 'label',
};

module.exports = FormLabel;
