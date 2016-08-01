/**
	Linear Gradient
	==============================

	Short-hand helper for adding a linear gradient to your component.

	- @param {String} sideOrCorner
	- @param {String} top
	- @param {String} bottom
	- @param {String} base (optional)
	- @returns {Object} css linear gradient declaration

	Spread the declaration into your component class:
	------------------------------

	myComponentClass: {
		...linearGradient(red, blue),
	}
*/

function linearGradient (direction, top, bottom, base = '') {
	return {
		background: `linear-gradient(${direction}, ${top} 0%, ${bottom} 100%) ${base}`,
	};
}

// Vertical Gradient
function gradientVertical (top, bottom, base) {
	return linearGradient('to bottom', top, bottom, base);
}

// Horizontal Gradient
function gradientHorizontal (top, bottom, base) {
	return linearGradient('to right', top, bottom, base);
}

/**
	Border Radius
	==============================

	Short-hand helper for border radii
*/

// top
function borderTopRadius (radius) {
	return {
		borderTopLeftRadius: radius,
		borderTopRightRadius: radius,
	};
}

// right
function borderRightRadius (radius) {
	return {
		borderBottomRightRadius: radius,
		borderTopRightRadius: radius,
	};
}

// bottom
function borderBottomRadius (radius) {
	return {
		borderBottomLeftRadius: radius,
		borderBottomRightRadius: radius,
	};
}

// left
function borderLeftRadius (radius) {
	return {
		borderBottomLeftRadius: radius,
		borderTopLeftRadius: radius,
	};
}

// Return

module.exports = {
	borderTopRadius,
	borderRightRadius,
	borderBottomRadius,
	borderLeftRadius,

	gradientHorizontal,
	gradientVertical,
};
