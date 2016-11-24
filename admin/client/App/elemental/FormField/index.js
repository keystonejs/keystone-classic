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
		const { formLayout = 'basic', labelWidth } = this.context;
		const {
			aphroditeStyles,
			children,
			className,
			cropLabel,
			htmlFor,
			label,
			offsetAbsentLabel,
			...props
		} = this.props;

		props.className = css(
			classes.FormField,
			classes['FormField--form-layout-' + formLayout],
			offsetAbsentLabel ? classes['FormField--offset-absent-label'] : null,
			aphroditeStyles
		);
		if (className) {
			props.className += (' ' + className);
		}
		if (offsetAbsentLabel && labelWidth) {
			props.style = {
				paddingLeft: labelWidth,
				...props.style,
			};
		}

		// elements
		const componentLabel = label ? (
			<FormLabel htmlFor={htmlFor} cropText={cropLabel}>
				{label}
			</FormLabel>
		) : null;

		return (
			<div {...props} htmlFor={htmlFor}>
				{componentLabel}
				{children}
			</div>
		);
	}
};

const stylesShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

FormField.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	labelWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};
FormField.childContextTypes = {
	formFieldId: PropTypes.string,
};
FormField.propTypes = {
	aphroditeStyles: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(stylesShape)),
		PropTypes.shape(stylesShape),
	]),
	children: PropTypes.node,
	cropLabel: PropTypes.bool,
	htmlFor: React.PropTypes.string,
	label: React.PropTypes.string,
	offsetAbsentLabel: React.PropTypes.bool,
};

function generateId () {
	return Math.random().toString(36).substr(2, 9);
};

module.exports = FormField;
