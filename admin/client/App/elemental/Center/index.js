import React, { PropTypes } from 'react';
import { css } from 'glamor';
import classes from './styles';

function Center ({
	className,
	component: Component,
	height,
	style,
	...props
}) {
	props.className = css(classes.center, className);
	props.style = { height, ...style };

	return <Component {...props} />;
};
Center.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	height: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};
Center.defaultProps = {
	component: 'div',
	height: 'auto',
};

module.exports = Center;
