import styled from 'styled-components';
import React, { PropTypes } from 'react';

function BlankState ({
	children,
	heading,
	component: Component,
	...props,
}) {
	const Comp = styled(Component)`
		text-align: center;

		background-color: ${props => props.theme.blankstate.background};
		border-radius: ${props => props.theme.blankstate.borderRadius};
		color: ${props => props.theme.blankstate.color};
		padding-bottom: ${props => props.theme.blankstate.paddingVertical};
		padding-left: ${props => props.theme.blankstate.paddingHorizontal};
		padding-right: ${props => props.theme.blankstate.paddingHorizontal};
		padding-top: ${props => props.theme.blankstate.paddingVertical};
	`;

	const Heading = styled.h2`
		color: inherit;
		&:last-child {
			margin-bottom: 0;
		}
	`;

	return (
		<Comp {...props}>
			{!!heading && <Heading data-e2e-blank-state-heading>{heading}</Heading>}
			{children}
		</Comp>
	);
};

BlankState.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
	heading: PropTypes.string,
};
BlankState.defaultProps = {
	component: 'div',
};

module.exports = BlankState;
