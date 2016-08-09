import { css, StyleSheet } from 'aphrodite/no-important';
import React, { cloneElement, Children, PropTypes } from 'react';
import styles from './styles';

function ButtonGroup ({
	children,
	className,
	component,
	...props,
}) {
	const Component = component;
	const count = Children.count(children) - 1;

	// prepare group className
	props.className = css(
		classes.alert,
		className
	);

	// clone children and apply classNames that aphrodite can target
	props.children = Children.map(children, (c, idx) => {
		const isOnlyChild = !count;
		const isFirstChild = !isOnlyChild && idx === 0;
		const isLastChild = !isOnlyChild && idx === count;
		const isMiddleChild = !isOnlyChild && !isFirstChild && !isLastChild;

		return cloneElement(c, {
			className: [
				classes.default,
				isMiddleChild && classes.middle,
				isFirstChild && classes.first,
				isLastChild && classes.last,
				c.props.active && classes.active,
			],
		});
	});

	return <Component {...props} />;
};

ButtonGroup.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};
ButtonGroup.defaultProps = {
	component: 'div',
};

const classes = StyleSheet.create(styles);

module.exports = ButtonGroup;
