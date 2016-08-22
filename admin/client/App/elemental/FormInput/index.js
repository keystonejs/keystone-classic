import React, { Component, PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import styles from './styles';
import concatClassnames from '../../../utils/concatClassnames';

const classes = StyleSheet.create(styles);

class FormInput extends Component {
	constructor () {
		super();

		this.focusInput = this.focusInput.bind(this);
	}
	componentWillReceiveProps (nextProps) {
		if (nextProps.focusInput && !this.props.focusInput) {
			this.focusInput();
		}
	}
	focusInput () {
		this.target.focus();
	}
	render () {
		// NOTE `focusInput` is declared to remove it from `props`, though never used
		const {
			className,
			id,
			focusInput, // eslint-disable-line no-unused-vars
			...props,
		} = this.props;
		const { formFieldId, formLayout } = this.context;
		props.id = id || formFieldId;
		props.className = css(
			classes.FormInput,
			formLayout ? classes['FormInput--form-layout-' + formLayout] : null,
			...concatClassnames(className)
		);

		const setRef = (n) => (this.target = n);

		return (
			<input ref={setRef} {...props} />
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
