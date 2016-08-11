import { css, StyleSheet } from 'aphrodite/no-important';
import React, { cloneElement, Children, Component, PropTypes } from 'react';
import styles from './styles';

function InlineGroup ({
	block,
	children,
	className,
	component,
	style,
	...props,
}) {

	// set the component
	const Component = component;

	// prepare group className
	props.className = css(
		classes.group,
		className
	);

	// prepare group styles
	props.style = {
		display: block ? 'flex' : 'inline-flex',
		...style,
	};

	// convert children to an array and filter out falsey values
	const buttons = Children.toArray(children).filter(i => i);

	// normalize the count
	const count = buttons.length - 1;

	// clone children and apply classNames that aphrodite can target
	props.children = buttons.map((c, idx) => {
		if (!c) return null;

		const isOnlyChild = !count;
		const isFirstChild = !isOnlyChild && idx === 0;
		const isLastChild = !isOnlyChild && idx === count;
		const isMiddleChild = !isOnlyChild && !isFirstChild && !isLastChild;

		return cloneElement(c, {
			padLeft: isLastChild || isMiddleChild,
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

InlineGroup.propTypes = {
	block: PropTypes.bool,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	contiguous: PropTypes.bool,
};
InlineGroup.defaultProps = {
	component: 'div',
};

const classes = StyleSheet.create(styles);

module.exports = InlineGroup;
