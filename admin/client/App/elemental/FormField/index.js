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
			children,
			className,
			cropLabel,
			htmlFor,
			label,
			offsetAbsentLabel,
			staticClassName,
			...props,
		} = this.props;

		// Property Violation
		if (typeof className === 'string') {
			console.error('FormField: use prop `staticClassName` for global CSS classes. Attempted className: "' + className + '".');
		}

		props.className = css(
			classes.FormField,
			classes['FormField--form-layout-' + formLayout],
			offsetAbsentLabel ? classes['FormField--offset-absent-label'] : null,
			className
		);
		if (staticClassName) {
			props.className += (' ' + staticClassName);
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
			<div {...props}>
				{componentLabel}
				{children}
			</div>
		);
	}
};

const classNameShape = {
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
	children: PropTypes.node,
	className: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(classNameShape)),
		PropTypes.shape(classNameShape),
	]),
	cropLabel: PropTypes.bool,
	htmlFor: React.PropTypes.string,
	label: React.PropTypes.string,
	offsetAbsentLabel: React.PropTypes.bool,
	staticClassName: PropTypes.string,
};

function generateId () {
	return Math.random().toString(36).substr(2, 9);
};

module.exports = FormField;
