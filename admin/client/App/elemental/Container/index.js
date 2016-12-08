import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import styles from './styles';
import sizes from './sizes';

const classes = StyleSheet.create(styles);

function Container ({
	className,
	clearFloatingChildren,
	component: Component,
	width,
	...props
}) {
	props.className = css(
		classes.container,
		classes[width],
		clearFloatingChildren ? classes.clearfix : null,
		className
	);

	return <Component {...props} />;
};

Container.propTypes = {
	clearFloatingChildren: PropTypes.bool,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
	width: PropTypes.oneOf(Object.keys(sizes)).isRequired,
};
Container.defaultProps = {
	component: 'div',
	width: 'large',
};

module.exports = Container;
