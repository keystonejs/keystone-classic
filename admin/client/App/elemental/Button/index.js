import { StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import cssClassNames from '../../../utils/cssClassNames';
import styles from './styles';

const commonClasses = StyleSheet.create(styles.common);
const stylesheetCache = {};
function getStyleSheet (variant, color) {
	const cacheKey = `${variant}-${color}`;
	if (!stylesheetCache[cacheKey]) {
		const variantStyles = styles[variant](color);
		stylesheetCache[cacheKey] = StyleSheet.create(variantStyles);
	}
	return stylesheetCache[cacheKey];
}

const BUTTON_SIZES = ['large', 'medium', 'small', 'xsmall'];
const BUTTON_VARIANTS = ['fill', 'hollow', 'link'];
const BUTTON_COLORS = ['default', 'primary', 'success', 'warning', 'danger', 'cancel', 'delete'];

function Button ({
	color,
	component,
	isActive,
	isBlock,
	isDisabled,
	size,
	variant,
	...props,
}) {
	// get the styles
	const variantClasses = getStyleSheet(variant, color);
	props.className = cssClassNames([
		commonClasses.base,
		commonClasses[size],
		variantClasses.base,
		isActive ? variantClasses.active : null,
		isBlock ? commonClasses.block : null,
		isDisabled ? commonClasses.disabled : null,
	]);
	// return an anchor or button
	if (!component) {
		component = props.href ? 'a' : 'button';
	}
	// Ensure buttons don't submit by default
	if (component === 'button' && !props.type) {
		props.type = 'button';
	}
	if (isDisabled) {
		props.disabled = 'disabled';
	}
	return React.createElement(component, props);
};

Button.propTypes = {
	color: PropTypes.oneOf(BUTTON_COLORS),
	component: PropTypes.element,
	href: PropTypes.string,
	isActive: PropTypes.bool,
	isBlock: PropTypes.bool,
	isDisabled: PropTypes.bool,
	size: PropTypes.oneOf(BUTTON_SIZES),
	variant: PropTypes.oneOf(BUTTON_VARIANTS),
};
Button.defaultProps = {
	color: 'default',
	variant: 'fill',
};

module.exports = Button;
