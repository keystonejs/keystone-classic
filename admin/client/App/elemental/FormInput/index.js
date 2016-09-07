import React, { Component, PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import styles from './styles';
import concatClassnames from '../../../utils/concatClassnames';
import InputNoedit from './noedit';

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
			disabled,
			focusInput, // eslint-disable-line no-unused-vars
			id,
			multiline,
			noedit,
			staticClassName,
			...props,
		} = this.props;

		// NOTE return a different component for `noedit`
		if (noedit) return <InputNoedit {...this.props} />;

		const { formFieldId, formLayout } = this.context;

		props.id = id || formFieldId;
		props.className = css(
			classes.FormInput,
			disabled ? classes['FormInput--disabled'] : null,
			formLayout ? classes['FormInput--form-layout-' + formLayout] : null,
			...concatClassnames(className)
		);
		if (staticClassName) {
			props.className += (' ' + staticClassName);
		}

		const setRef = (n) => (this.target = n);
		const Tag = multiline ? 'textarea' : 'input';

		return (
			<Tag
				ref={setRef}
				disabled={props.disabled}
				{...props}
			/>
		);
	}
};


FormInput.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};
FormInput.propTypes = {
	multiline: PropTypes.bool,
	staticClassName: PropTypes.string,
	type: PropTypes.string,
};
FormInput.defaultProps = {
	type: 'text',
};

module.exports = FormInput;
