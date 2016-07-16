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

function linearGradient (sideOrCorner, top, bottom, base) {
	return {
		background: `linear-gradient(to bottom, ${top}, ${bottom}) ${base}`,
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
