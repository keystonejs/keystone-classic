import styled, { css } from 'styled-components';
import React, { PropTypes } from 'react';

function Alert ({
	color,
	component: Component,
	...outerProps,
}) {
	if (color === 'error') color = 'danger';
	const Comp = styled(Component)`
		border-color: transparent;
		color: inherit;

		${props => props.strong && css`font-weight: 500;`}
		border-radius: ${props => props.theme.alert.borderRadius};
		border-style: solid;
		border-width: ${props => props.theme.alert.borderWidth};
		margin: ${props => props.theme.alert.margin};
		padding: ${props => props.theme.alert.padding};
		background-color: ${props => props.theme.alert.color[color].background};
		border-color: ${props => props.theme.alert.color[color].border};
		color: ${props => props.theme.alert.color[color].text};
	`;

	return <Comp {...outerProps} data-alert-type={color} />;
};

Alert.propTypes = {
	color: PropTypes.oneOf(['danger', 'error', 'info', 'success', 'warning']).isRequired,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};
Alert.defaultProps = {
	component: 'div',
};

module.exports = Alert;
