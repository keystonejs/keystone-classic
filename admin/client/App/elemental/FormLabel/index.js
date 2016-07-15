import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';
import styles from './styles';

const classes = StyleSheet.create(styles);

class FormLabel extends Component {
	render () {
		const { formFieldId, formLayout } = this.context;
		const { className, component, htmlFor } = this.props;
		let consumedProps = Object.assign({}, this.props);
		consumedProps.htmlFor = htmlFor || formFieldId;

		consumedProps.className = classnames(
			css(classes.FormLabel), {
				[css(classes['FormLabel--form-layout-' + formLayout])]: formLayout,
			}, className
		);

		return React.createElement(component, consumedProps);
	}
};


FormLabel.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};
FormLabel.propTypes = {
	component: PropTypes.node,
};
FormLabel.defaultProps = {
	component: 'label',
};

module.exports = FormLabel;
