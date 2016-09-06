import { StyleSheet, css } from 'aphrodite/no-important';
import React, { Component, PropTypes } from 'react';

import styles from './styles';
import FormLabel from '../FormLabel';

const classes = StyleSheet.create(styles);

class FormField extends Component {
	constructor () {
		super();
		this.formFieldId = generateId();
	}
	getChildContext () {
		return {
			formFieldId: this.formFieldId,
		};
	}
	render () {
		const { formLayout } = this.context;
		const { children, className, cropLabel, htmlFor, label, offsetAbsentLabel, ...props } = this.props;
		const classnameIsAphrodite = typeof className !== 'string';

		props.className = css(
			classes.FormField,
			classes['FormField--form-layout-' + formLayout],
			offsetAbsentLabel ? classes['FormField--offset-absent-label'] : null,
			classnameIsAphrodite ? className : null
		);

		if (!classnameIsAphrodite) {
			props.className += ' ' + className;
		}

		// elements
		const componentLabel = label ? (
			<FormLabel htmlFor={htmlFor} cropText={cropLabel}>
				{label}
			</FormLabel>
		) : null;

		return (
			<div {...props}>
				{componentLabel}
				{children}
			</div>
		);
	}
};

FormField.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']).isRequired,
};
FormField.childContextTypes = {
	formFieldId: PropTypes.string,
};
FormField.propTypes = {
	children: PropTypes.node,
	className: React.PropTypes.string,
	cropLabel: PropTypes.bool,
	htmlFor: React.PropTypes.string,
	label: React.PropTypes.string,
	offsetAbsentLabel: React.PropTypes.bool,
};

function generateId () {
	return Math.random().toString(36).substr(2, 9);
};

module.exports = FormField;
