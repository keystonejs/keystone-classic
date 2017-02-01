import { css } from 'glamor';
import React, { PropTypes } from 'react';
import classes from './styles';

function FormLabel ({
	aphroditeStyles,
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
		aphroditeStyles
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
	aphroditeStyles: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(stylesShape)),
		PropTypes.shape(stylesShape),
	]),
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	cropText: PropTypes.bool,
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
