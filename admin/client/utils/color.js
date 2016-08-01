/**
	Validate Hex
	==============================

	@param {String} hex

	1. remove hash if present
	2. convert from 3 to 6 digit color code & ensure valid hex
*/

function validateHex (color) {
	const hex = color.replace('#', '');

	if (hex.length === 3) {
		return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error(`Invalid color value provided: "${color}"`);
	}

	return hex;
};

/**
	Fade Color
	==============================

	Takes a hexidecimal color, converts it to RGB and applies an alpha value.

	@param {String} color
	@param {Number} opacity (0-100)

	1. convert hex to RGB
	2. combine and add alpha channel
*/

function fade (color, opacity = 100) {
	const decimalFraction = opacity / 100;
	const hex = validateHex(color);

	// 1.
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// 2.
	const result = 'rgba('
		+ r + ','
		+ g + ','
		+ b + ','
		+ decimalFraction
		+ ')';

	return result;
};


/**
	Shade Color
	==============================

	Takes a hexidecimal color, converts it to RGB and lightens or darkens

	@param {String} color
	@param {Number} opacity (0-100)

	1. do fancy RGB bitwise operations
	2. combine back into a hex value
*/

function shade (color, percent) {
	const decimalFraction = percent / 100;
	const hex = validateHex(color);

	// 1.
	let f = parseInt(hex, 16);
	let t = decimalFraction < 0 ? 0 : 255;
	let p = decimalFraction < 0 ? decimalFraction * -1 : decimalFraction;

	const R = f >> 16;
	const G = f >> 8 & 0x00FF;
	const B = f & 0x0000FF;

	// 2.
	return '#' + (0x1000000
		+ (Math.round((t - R) * p) + R) * 0x10000
		+ (Math.round((t - G) * p) + G) * 0x100
		+ (Math.round((t - B) * p) + B)).toString(16).slice(1);
};

// shade helpers
const lighten = shade;
function darken (color, percent) {
	return shade(color, percent * -1);
};


/**
	Blend Color
	==============================

	Takes two hexidecimal colors and blend them together

	@param {String} color1
	@param {String} color2
	@param {Number} percent (0-100)

	1. do fancy RGB bitwise operations
	2. combine back into a hex value
*/

function blend (color1, color2, percent) {
	const decimalFraction = percent / 100;
	const hex1 = validateHex(color1);
	const hex2 = validateHex(color2);

	// 1.
	const f = parseInt(hex1, 16);
	const t = parseInt(hex2, 16);

	const R1 = f >> 16;
	const G1 = f >> 8 & 0x00FF;
	const B1 = f & 0x0000FF;

	const R2 = t >> 16;
	const G2 = t >> 8 & 0x00FF;
	const B2 = t & 0x0000FF;

	// 2.
	return '#' + (0x1000000
		+ (Math.round((R2 - R1) * decimalFraction) + R1) * 0x10000
		+ (Math.round((G2 - G1) * decimalFraction) + G1) * 0x100
		+ (Math.round((B2 - B1) * decimalFraction) + B1)).toString(16).slice(1);
}

module.exports = {
	blend,
	darken,
	fade,
	lighten,
};
