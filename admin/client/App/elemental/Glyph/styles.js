// ==============================
// Glyph
// ==============================

import colors from './colors';
import sizes from './sizes';

// Prepare variants
const colorVariants = {};
Object.keys(colors).forEach(color => {
	colorVariants[`color__${color}`] = {
		color: colors[color],
	};
});

// Prepare sizes
const sizeVariants = {};
Object.keys(sizes).forEach(size => {
	sizeVariants[`size__${size}`] = {
		fontSize: sizes[size],
	};
});

module.exports = {
	glyph: {},

	// Colors
	...colorVariants,

	// Sizes
	...sizeVariants,
};
