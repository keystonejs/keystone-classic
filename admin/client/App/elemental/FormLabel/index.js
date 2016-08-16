import { StyleSheet, css } from 'aphrodite/no-important';
import classnames from 'classnames';
import React, { PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

const FormLabel = (props, context) => {
	const { formFieldId, formLayout } = context;
	const { className, component, htmlFor } = props;
	const consumedProps = Object.assign({}, props);
	consumedProps.htmlFor = htmlFor || formFieldId;
	delete consumedProps.component;

	consumedProps.className = classnames(
		css(classes.FormLabel), {
			[css(classes['FormLabel--form-layout-' + formLayout])]: formLayout,
		}, className
	);

	return React.createElement(component, consumedProps);
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
};
FormLabel.defaultProps = {
	component: 'label',
};

module.exports = FormLabel;
