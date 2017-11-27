import { css } from 'glamor';
import React, { PropTypes } from 'react';
import classes from './styles';

function FormLabel ({
	cssStyles,
	className,
	component: Component,
	cropText,
	htmlFor,
	...props
},
{
	formFieldId,
	formLayout,
	labelWidth,
}) {
	props.htmlFor = htmlFor || formFieldId;
	props.className = css(
		classes.FormLabel,
		formLayout ? classes['FormLabel--form-layout-' + formLayout] : null,
		cropText ? classes['FormLabel--crop-text'] : null,
		cssStyles
	);
	if (className) {
		props.className += (' ' + className);
	}
	if (labelWidth) {
		props.style = {
			width: labelWidth,
			...props.style,
		};
	}

	return <Component {...props} />;
};

const stylesShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

FormLabel.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	cropText: PropTypes.bool,
	cssStyles: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(stylesShape)),
		PropTypes.shape(stylesShape),
	]),
};
FormLabel.defaultProps = {
	component: 'label',
};
FormLabel.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
	labelWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

module.exports = FormLabel;
