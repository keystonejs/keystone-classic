import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';

import octicons from './octicons';
import colors from './colors';
import sizes from './sizes';
import styles from './styles';

const classes = StyleSheet.create(styles);

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

function Glyph ({
	aphroditeStyles,
	className,
	color,
	component: Component,
	name,
	size,
	style,
	...props
}) {
	const colorIsValidType = Object.keys(colors).includes(color);
	props.className = css(
		classes.glyph,
		colorIsValidType && classes['color__' + color],
		classes['size__' + size],
		aphroditeStyles
	) + ` ${octicons[name]}`;
	if (className) {
		props.className += (' ' + className);
	}

	// support random color strings
	props.style = {
		color: !colorIsValidType ? color : null,
		...style,
	};

	return <Component {...props} />;
};

Glyph.propTypes = {
	aphroditeStyles: PropTypes.shape({
		_definition: PropTypes.object,
		_name: PropTypes.string,
	}),
	color: PropTypes.oneOfType([
		PropTypes.oneOf(Object.keys(colors)),
		PropTypes.string, // support random color strings
	]),
	name: PropTypes.oneOf(Object.keys(octicons)).isRequired,
	size: PropTypes.oneOf(Object.keys(sizes)),
};
Glyph.defaultProps = {
	component: 'i',
	color: 'inherit',
	size: 'small',
};

module.exports = Glyph;
