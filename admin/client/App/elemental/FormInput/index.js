import React, { Component, PropTypes } from 'react';
import { css } from 'glamor';
import classes from './styles';
import concatClassnames from '../../../utils/concatClassnames';
import InputNoedit from './noedit';

// NOTE must NOT be functional component to allow `refs`

class FormInput extends Component {
	blur () {
		this.target.blur();
	}
	focus () {
		this.target.focus();
	}
	render () {
		const {
			cssStyles,
			className,
			disabled,
			id,
			multiline,
			noedit,
			size,
			...props
		} = this.props;

		// NOTE return a different component for `noedit`
		if (noedit) return <InputNoedit {...this.props} />;

		const { formFieldId, formLayout } = this.context;

		props.id = id || formFieldId;
		props.className = css(
			classes.FormInput,
			classes['FormInput__size--' + size],
			disabled ? classes['FormInput--disabled'] : null,
			formLayout ? classes['FormInput--form-layout-' + formLayout] : null,
			...concatClassnames(cssStyles)
		);
		if (className) {
			props.className += (' ' + className);
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

const stylesShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

FormInput.propTypes = {
	cssStyles: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(stylesShape)),
		PropTypes.shape(stylesShape),
	]),
	multiline: PropTypes.bool,
	size: PropTypes.oneOf(['default', 'small', 'large']),
	type: PropTypes.string,
};
FormInput.defaultProps = {
	size: 'default',
	type: 'text',
};
FormInput.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};

module.exports = FormInput;
