import { css, StyleSheet } from 'aphrodite/no-important';
import React, { Component, PropTypes } from 'react';
import styles from './styles';
import concatClassnames from '../../../utils/concatClassnames';

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

// NOTE must NOT be functional component to allow `refs`

class Button extends Component {
	render () {
		var {
			active,
			block,
			className,
			color,
			component: Tag,
			disabled,
			size,
			variant,
			...props,
		} = this.props;

		// Property Violation
		if (typeof className === 'string') {
			console.error('Button: use prop `staticClassName` for global CSS classes. Attempted className: "' + className + '".');
		}

		// get the styles
		const variantClasses = getStyleSheet(variant, color);
		props.className = css(
			commonClasses.base,
			commonClasses[size],
			variantClasses.base,
			block ? commonClasses.block : null,
			disabled ? commonClasses.disabled : null,
			active ? variantClasses.active : null,
			...concatClassnames(className)
		);

		// return an anchor or button
		if (!Tag) {
			Tag = props.href ? 'a' : 'button';
		}
		// Ensure buttons don't submit by default
		if (Tag === 'button' && !props.type) {
			props.type = 'button';
		}

		return <Tag {...props} />;
	}
};

const classNameShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

Button.propTypes = {
	active: PropTypes.bool,
	block: PropTypes.bool,
	className: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(classNameShape)),
		PropTypes.shape(classNameShape),
	]),
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
