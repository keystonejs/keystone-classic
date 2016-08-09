import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';

import octicons from './octicons';
import colors from './colors';
import sizes from './sizes';
import styles from './styles';

const classes = StyleSheet.create(styles);

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

function Glyph ({ className, color, component, name, size, ...props }) {
	const Component = component;
	props.className = css(
		classes.glyph,
		classes['color__' + color],
		classes['size__' + size],
		className
	) + ` ${octicons[name]}`;

	return <Component {...props} />;
};

Glyph.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)),
	name: PropTypes.oneOf(Object.keys(octicons)).isRequired,
	size: PropTypes.oneOf(Object.keys(sizes)),
};
Glyph.defaultProps = {
	component: 'i',
	color: 'inherit',
	size: 'small',
};

module.exports = Glyph;
