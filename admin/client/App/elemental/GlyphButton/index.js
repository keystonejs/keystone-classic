/* eslint quote-props: ["error", "as-needed"] */

import React, { PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import Button from '../Button';
import Glyph from '../Glyph';

function GlyphButton ({ children, glyph, glyphColor, glyphSize, position, ...props }) {
	const isDefault = position === 'default';
	const isLeft = position === 'left';
	const isRight = position === 'right';

	// prepare the icon
	const icon = (
		<Glyph
			className={css(classes.glyph)}
			color={glyphColor}
			name={glyph}
			size={glyphSize}
		/>
	);

	// render that shit
	return (
		<Button {...props}>
			{(isDefault || isLeft) && icon}
			{children}
			{isRight && icon}
		</Button>
	);
};

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
GlyphButton.propTypes = {
	glyph: PropTypes.string,
	glyphColor: PropTypes.string,
	glyphSize: PropTypes.string,
	position: PropTypes.oneOf(['default', 'left', 'right']),
};
GlyphButton.defaultProps = {
	position: 'default', // no margin, assumes no children
};

const classes = StyleSheet.create({
	glyph: {
		display: 'inline-block',
		marginTop: '-0.125em', // fix icon alignment
		verticalAlign: 'middle',

		// add spacing
		':first-child': {
			marginRight: '0.5em',
		},
		':last-child': {
			marginLeft: '0.5em',
		},
		':only-child': {
			marginLeft: 0,
			marginRight: 0,
		},
	},
});

module.exports = GlyphButton;
