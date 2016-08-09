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
	active,
	block,
	className,
	color,
	component,
	disabled,
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
		active ? variantClasses.active : null,
		block ? commonClasses.block : null,
		disabled ? commonClasses.disabled : null,
		className,
	]);

	// return an anchor or button
	if (!component) {
		component = props.href ? 'a' : 'button';
	}
	// Ensure buttons don't submit by default
	if (component === 'button' && !props.type) {
		props.type = 'button';
	}

	return React.createElement(component, props);
};

Button.propTypes = {
	active: PropTypes.bool,
	block: PropTypes.bool,
	color: PropTypes.oneOf(BUTTON_COLORS),
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	disabled: PropTypes.bool,
	href: PropTypes.string,
	size: PropTypes.oneOf(BUTTON_SIZES),
	variant: PropTypes.oneOf(BUTTON_VARIANTS),
};
Button.defaultProps = {
	color: 'default',
	variant: 'fill',
};

module.exports = Button;
