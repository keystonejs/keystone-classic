import styled from 'styled-components';
import React, { Component, PropTypes } from 'react';

import { base, sizes, hollow, fill, link } from './styles';

const BUTTON_SIZES = ['large', 'medium', 'small', 'xsmall'];
const BUTTON_VARIANTS = ['fill', 'hollow', 'link'];
const BUTTON_COLORS = ['default', 'primary', 'success', 'warning', 'danger', 'cancel', 'delete'];

// NOTE must NOT be functional component to allow `refs`

class Button extends Component {
	render () {
		var {
			component: Tag,
			...props,
		} = this.props;

		// return an anchor or button
		if (!Tag) {
			Tag = props.href ? 'a' : 'button';
		}
		// Ensure buttons don't submit by default
		if (Tag === 'button' && !props.type) {
			props.type = 'button';
		}
		if (props.color === 'cancel' || props.color === 'delete') props.color = 'danger';

		const Component = styled(Tag)`
			${base}
			${sizes}

			${props => props.variant === 'hollow' && hollow}
			${props => props.variant === 'fill' && fill}
			${props => {
				if (props.variant === 'link') {
					let textColor, hoverColor;
					switch (props.color) {
						case 'default':
							textColor = props.theme.color.link;
							hoverColor = props.theme.color.linkHover;
							break;
						case 'danger':
							textColor = props.theme.color.gray40;
							hoverColor = props.theme.color.danger;
							break;
						default:
							textColor = props.theme.color[props.color];
							hoverColor = props.theme.color[props.color];
							break;
					}
					return link(textColor, hoverColor);
				}
			}}
		`;

		return <Component {...props} />;
	}
};

Button.propTypes = {
	active: PropTypes.bool,
	block: PropTypes.bool,
	className: PropTypes.string,
	color: PropTypes.oneOf(BUTTON_COLORS),
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	disabled: PropTypes.bool,
	href: PropTypes.string,
	size: PropTypes.oneOf(BUTTON_SIZES),
	variant: PropTypes.oneOf(BUTTON_VARIANTS),
};
Button.defaultProps = {
	color: 'default',
	variant: 'fill',
};

module.exports = Button;
