import React, { PropTypes } from 'react';
import styled from 'styled-components';

function Center ({
	component: Component,
	...props,
}) {
	const Comp = styled(Component)`
		display: flex;
		justify-content: center;
		align-items: center;
		height: ${props => props.height};
	`;

	return <Comp {...props} />;
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
