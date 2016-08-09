import { css, StyleSheet } from 'aphrodite/no-important';
import React, { cloneElement, Children, PropTypes } from 'react';
import styles from './styles';
import cssClassNames from '../../../utils/cssClassNames';
import colors from './colors';

const classes = StyleSheet.create(styles);

// clone children if a class exists for the tagname
const cloneWithClassnames = (c) => {
	if (!c.type || !classes[c.type]) return c;

	return cloneElement(c, {
		className: css(classes[c.type]),
	});
};

function Alert ({ children, className, color, component, ...props }) {
	const Component = component;
	props.className = cssClassNames([
		classes.alert,
		classes[color],
		className,
	]);
	props.children = Children.map(children, cloneWithClassnames);

	return <Component {...props} />;
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
