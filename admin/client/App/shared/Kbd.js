import styled from 'styled-components';
import { darken, lighten } from '../../utils/color';

const Kbd = styled.kbd`
	background-color: ${props => props.theme.color.body};
	border-radius: 3px;
	border: 1px solid #ccc;
	border-bottom-color: ${darken('#ccc', 4)};
	border-top-color: ${lighten('#ccc', 4)};
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
	display: inline-block;
	font-family: Consolas, "Liberation Mono", Courier, monospace;
	font-size: 0.85em;
	font-weight: 700;
	line-height: inherit;
	padding: 1px 4px;
	white-space: no-wrap;

	/* Little hack to tweak "visual-middle" alignment */
	position: relative;
	top: -1;
`;

module.exports = Kbd;
