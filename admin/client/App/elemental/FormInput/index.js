import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';
import styles from './styles';

const classes = StyleSheet.create(styles);

class FormInput extends Component {
	render () {
		const { formFieldId, formLayout } = this.context;
		const { className, id } = this.props;
		let consumedProps = Object.assign({}, this.props);
		consumedProps.id = id || formFieldId;

		consumedProps.className = classnames(
			css(classes.FormInput), {
				[css(classes['FormInput--form-layout-' + formLayout])]: formLayout,
			}, className
		);

		return (
			<input {...consumedProps} />
		);
	}
};


FormInput.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};
FormInput.propTypes = {
	type: PropTypes.string,
};
FormInput.defaultProps = {
	type: 'text',
};

module.exports = FormInput;
