import { StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';

import cssClassNames from '../../../utils/cssClassNames';
import octicons from './octicons';
import colors from './colors';
import sizes from './sizes';
import styles from './styles';

const classes = StyleSheet.create(styles);

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

function Glyph ({ className, color, name, size, ...props }) {
	props.className = cssClassNames([
		classes.glyph,
		classes['color__' + color],
		classes['size__' + size],
	], cssStaticNames([octicons[name], className]));

	return <span {...props} />;
};

Glyph.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)),
	name: PropTypes.oneOf(Object.keys(octicons)).isRequired,
	size: PropTypes.oneOf(Object.keys(sizes)),
};
Glyph.defaultProps = {
	color: 'inherit',
	size: 'small',
};

function cssStaticNames (arr) {
	if (!arr.length || !Array.isArray(arr)) return '';

	return arr.filter(i => i).join(' ');
}

module.exports = Glyph;
