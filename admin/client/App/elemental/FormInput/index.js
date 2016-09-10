import React, { Component, PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import styles from './styles';
import concatClassnames from '../../../utils/concatClassnames';
import InputNoedit from './noedit';

const classes = StyleSheet.create(styles);

// NOTE must NOT be functional component to allow `refs`

class FormInput extends Component {
	render () {
		const {
			className,
			disabled,
			id,
			multiline,
			noedit,
			staticClassName,
			...props,
		} = this.props;

		console.log('FormInput className', className);

		// Property Violation
		if (typeof className === 'string') {
			console.error('FormInput: use prop `staticClassName` for global CSS classes. Attempted className: "' + className + '".');
		}

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

const classNameShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

FormInput.propTypes = {
	className: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(classNameShape)),
		PropTypes.shape(classNameShape),
	]),
	multiline: PropTypes.bool,
	staticClassName: PropTypes.string,
	type: PropTypes.string,
};
FormInput.defaultProps = {
	type: 'text',
};
FormInput.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};

module.exports = FormInput;
