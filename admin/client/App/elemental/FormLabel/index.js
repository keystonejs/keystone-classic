import { StyleSheet, css } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

function FormLabel (
	{ className, component: Component, cropText, htmlFor, ...props },
	{ formFieldId, formLayout }
) {
	props.htmlFor = htmlFor || formFieldId;
	props.className = css(
		classes.FormLabel,
		formLayout ? classes['FormLabel--form-layout-' + formLayout] : null,
		cropText ? classes['FormLabel--crop-text'] : null,
		className
	);

	return <Component {...props} />;
};


FormLabel.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
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
