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

function linearGradient (direction, top, bottom, base) {
	return {
		background: `linear-gradient(${direction}, ${top} 0%, ${bottom} 100% ) ${base}`.trim(),
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

module.exports = {
	gradientHorizontal,
	gradientVertical,
};
