// ==============================
// Button
// ==============================

import { css } from 'styled-components';
import { gradientVertical } from '../../../utils/css';
import { darken, fade, lighten } from '../../../utils/color';

// Base styles
const base = css`
	appearance: none;
	background: none;
	border-width: ${props => props.theme.button.borderWidth};
	border-style: solid;
	border-color: transparent;
	border-radius: ${props => props.theme.button.borderRadius};
	cursor: pointer;
	display: inline-block;
	font-weight: ${props => props.theme.button.font.weight};
	height: ${props => props.theme.component.height};
	line-height: ${props => props.theme.component.lineHeight};
	margin-bottom: 0;
	padding: 0 ${props => props.theme.button.paddingHorizontal};
	outline: 0;
	text-align: center;
	touch-action: manipulation;
	user-select: none;
	vertical-align: middle;
	white-space: nowrap;
	&:hover,
	&:focus {
		color: ${props => props.theme.button.default.textColor};
		text-decoration: none;
	}

	/* Types */
	${props => props.block && css`
		display: block;
		width: 100%;
	`}
	${props => props.disabled && css`
		opacity: 0.4;
		pointer-events: none;
	`}
`;

// Size adaptations
const sizes = css`
	font-size: ${props => props.theme.font.size.default};
	font-size: ${props => props.theme.font.size[props.size]};
	${props => props.size === 'xsmall' && css`
		line-height: 1.9em;
		padding-left: .66em;
		padding-right: .66em;
	`};
`;

// Hollow styles
const hollow = css`
	background: none;
	border-color: ${props => props.theme.button[props.color].borderColor};
	color: ${props => props.theme.button[props.color].bgColor};

	&:hover,
	&:focus {
		background-image: none;
		background-color: ${props => fade(props.theme.button[props.color].borderColor, 15)};
		border-color: ${props => darken(props.theme.button[props.color].borderColor, 15)};
		box-shadow: none;
		color: ${props => props.theme.button[props.color].bgColor};
	}

	&:focus {
		box-shadow: 0 0 0 3px ${props => fade(props.theme.button[props.color].borderColor, 10)};
	}

	&:active {
		background-color: ${props => fade(props.theme.button[props.color].borderColor, 35)};
		border-color: ${props => darken(props.theme.button[props.color].borderColor, 25)};
		box-shadow: none;
	}
`;

// Filled styles
const fill = css`
	${props => ({
		...gradientVertical(
			lighten(props.theme.button[props.color].bgColor, 5),
			darken(props.theme.button[props.color].bgColor, 10),
			props.theme.button[props.color].bgColor
		),
	})}
	border-color: ${props => darken(props.theme.button[props.color].bgColor, 10)} ${props => darken(props.theme.button[props.color].bgColor, 20)} ${props => darken(props.theme.button[props.color].bgColor, 25)};
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
	color: white;
	font-weight: 400;
	text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);

	&:hover,
	&:focus {
		${props => ({
			...gradientVertical(
				lighten(props.theme.button[props.color].bgColor, 10),
				darken(props.theme.button[props.color].bgColor, 5)
			),
		})}
		border-color: ${props => darken(props.theme.button[props.color].bgColor, 5)} ${props => darken(props.theme.button[props.color].bgColor, 10)} ${props => darken(props.theme.button[props.color].bgColor, 15)};
		box-shadow: 0 1px 0 rgba(0,0,0,0.1);
		color: white;
		outline: none;
	}

	&:focus {
		box-shadow: 0 0 0 3px ${props => fade(props.theme.button[props.color].bgColor, 25)};
	}

	&:active {
		background-color: ${props => darken(props.theme.button[props.color].bgColor, 10)};
		background-image: none;
		border-color: ${props => darken(props.theme.button[props.color].bgColor, 25)} ${props => darken(props.theme.button[props.color].bgColor, 15)} ${props => darken(props.theme.button[props.color].bgColor, 10)};
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}
`;

// Link styles
const link = (textColor, hoverColor) => (
	css`
		background: none;
		border: 0;
		box-shadow: none;
		color: ${textColor};
		font-weight: normal;
		outline: none;

		&:hover,
		&:focus,
		&:active {
			color: ${hoverColor};
			text-decoration: underline;
		}

		${props => props.color === 'danger' && css`
			&:hover {
				${{ ...gradientVertical(lighten(hoverColor, 10), darken(hoverColor, 10)) }}
				background-color: ${hoverColor};
				border-color: ${darken(hoverColor, 4)} ${darken(hoverColor, 8)} ${darken(hoverColor, 12)};
				box-shadow: 0 1px 0 rgba(0,0,0,0.1);
				color: white;
				text-decoration: none;
			}

			&:active {
				background-color: ${darken(hoverColor, 4)};
				background-image: none;
				border-color: ${darken(hoverColor, 12)} ${darken(hoverColor, 8)} ${darken(hoverColor, 8)};
				box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
				color: white;
			}
		`}
	`
);

export { base, sizes, hollow, fill, link };
