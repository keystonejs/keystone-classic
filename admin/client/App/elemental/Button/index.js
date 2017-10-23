import { css } from 'glamor';
import React, { Component, PropTypes } from 'react';
import styles from './styles';

const commonClasses = styles.common;
const stylesheetCache = {};
function getStyleSheet (variant, color) {
	const cacheKey = `${variant}-${color}`;
	if (!stylesheetCache[cacheKey]) {
		const variantStyles = styles[variant](color);
		stylesheetCache[cacheKey] = variantStyles;
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
			cssStyles,
			block,
			className,
			color,
			component: Tag,
			disabled,
			size,
			variant,
			...props
		} = this.props;

		// get the styles
		const variantClasses = getStyleSheet(variant, color);
		props.className = css(
			commonClasses.base,
			commonClasses[size],
			variantClasses.base,
			block ? commonClasses.block : null,
			disabled ? commonClasses.disabled : null,
			active ? variantClasses.active : null,
			...cssStyles
		);
		if (className) {
			props.className += (' ' + className);
		}

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

Button.propTypes = {
	active: PropTypes.bool,
	block: PropTypes.bool,
	color: PropTypes.oneOf(BUTTON_COLORS),
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	cssStyles: PropTypes.arrayOf(PropTypes.shape({
		_definition: PropTypes.object,
		_name: PropTypes.string,
	})),
	disabled: PropTypes.bool,
	href: PropTypes.string,
	size: PropTypes.oneOf(BUTTON_SIZES),
	variant: PropTypes.oneOf(BUTTON_VARIANTS),
};
Button.defaultProps = {
	cssStyles: [],
	color: 'default',
	variant: 'fill',
};

module.exports = Button;
