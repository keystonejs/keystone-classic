import blacklist from 'blacklist';
import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';
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
		const { children, className, label, offsetAbsentLabel } = this.props;

		// classes
		var componentClass = classnames(
			css(classes.FormField), {
				[css(classes['FormField--offset-absent-label'])]: offsetAbsentLabel,
				[css(classes['FormField--form-layout-' + formLayout])]: formLayout,
			}, className);

		// props
		var props = blacklist(this.props, 'className', 'label', 'offsetAbsentLabel');

		// elements
		var componentLabel = label ? (
			<FormLabel>
				{label}
			</FormLabel>
		) : null;

		return (
			<div className={componentClass} {...props}>
				{componentLabel}
				{children}
			</div>
		);
	}
};

FormField.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
};
FormField.childContextTypes = {
	formFieldId: PropTypes.string,
};
FormField.propTypes = {
	children: PropTypes.node,
	className: React.PropTypes.string,
	htmlFor: React.PropTypes.string,
	label: React.PropTypes.string,
	offsetAbsentLabel: React.PropTypes.bool,
	variant: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
};
FormField.defaultProps = {
	component: 'form',
	htmlFor: generateId(),
	variant: 'basic',
};

function generateId () {
	return Math.random().toString(36).substr(2, 9);
};

module.exports = FormField;
