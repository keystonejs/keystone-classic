import { css, StyleSheet } from 'aphrodite/no-important';
import React, { cloneElement, Children, PropTypes } from 'react';
import styles from './styles';
import colors from './colors';

const classes = StyleSheet.create(styles);

// clone children if a class exists for the tagname
const cloneWithClassnames = (c) => {
	const type = c.type && c.type.displayName
		? c.type.displayName
		: c.type || null;

	if (!type || !classes[type]) return c;

	return cloneElement(c, {
		className: css(classes[type]),
	});
};

function Alert ({
	children,
	className,
	color,
	component: Component,
	...props
}) {
	props.className = css(
		classes.alert,
		classes[color],
		className
	);
	props.children = Children.map(children, cloneWithClassnames);

	return <Component {...props} data-alert-type={color} />;
};

Alert.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)).isRequired,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};
Alert.defaultProps = {
	component: 'div',
};

module.exports = Alert;
