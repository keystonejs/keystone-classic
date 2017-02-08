/* eslint quote-props: ["error", "as-needed"] */

import React, { PropTypes } from 'react';
import Button from '../Button';
import Glyph from '../Glyph';

function GlyphButton ({
	children,
	glyph,
	glyphColor,
	glyphSize,
	glyphStyle,
	position,
	...props
}) {
	const isDefault = position === 'default';
	const isLeft = position === 'left';
	const isRight = position === 'right';

	const offset = {};
	if (isLeft) offset.marginRight = '0.5em';
	if (isRight) offset.marginLeft = '0.5em';

	const glyphStyles = {
		...offset,
		...glyphStyle,
	};

	const icon = (
		<Glyph
			aphroditeStyles={classes.glyph}
			color={glyphColor}
			name={glyph}
			size={glyphSize}
			style={glyphStyles}
		/>
	);

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
	glyphStyle: PropTypes.object,
	position: PropTypes.oneOf(['default', 'left', 'right']),
};
GlyphButton.defaultProps = {
	glyphStyle: {},
	position: 'default', // no margin, assumes no children
};

const classes = {
	glyph: {
		display: 'inline-block',
		marginTop: '-0.125em', // fix icon alignment
		verticalAlign: 'middle',
	},
};

module.exports = GlyphButton;
