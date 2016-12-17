/* eslint quote-props: ["error", "as-needed"] */

import React, { PropTypes } from 'react';
import { StyleSheet } from 'aphrodite/no-important';
import Field from '../FormField';
import Glyph from '../Glyph';

function GlyphField ({
	children,
	glyph,
	glyphColor,
	glyphSize,
	position,
	...props
}) {
	const isLeft = position === 'left';
	const isRight = position === 'right';

	const glyphStyles = {};
	if (isLeft) glyphStyles.marginRight = '0.5em';
	if (isRight) glyphStyles.marginLeft = '0.5em';

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
		<Field aphroditeStyles={classes.wrapper} {...props}>
			{isLeft && icon}
			{children}
			{isRight && icon}
		</Field>
	);
};

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
GlyphField.propTypes = {
	glyph: PropTypes.string,
	glyphColor: PropTypes.string,
	glyphSize: PropTypes.string,
	position: PropTypes.oneOf(['left', 'right']),
};
GlyphField.defaultProps = {
	position: 'left',
};

const classes = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		display: 'flex',
	},
	glyph: {
		display: 'inline-block',
		marginTop: '-0.125em', // fix icon alignment
		verticalAlign: 'middle',
	},
});

module.exports = GlyphField;
