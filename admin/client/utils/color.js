/*
	Fade Color
	==============================

	Takes a hexidecimal color, converts it to RGB and applies an alpha value.

		1. remove hash if present
		2. convert from 3 to 6 digit color code & ensure valid hex
		3. convert hex to RGB
		4. combine and add alpha channel
*/

function fadeColor (color, opacity = 100) {
	// 1.
	var hex = color.replace('#', '');

	// 2.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error(`Invalid color value provided: "${color}"`);
	}

	// 3.
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	// 4.
	let result = 'rgba('
		+ r + ','
		+ g + ','
		+ b + ','
		+ opacity / 100
		+ ')';

	return result;
};


/*
	Shade Color
	==============================

	Takes a hexidecimal color, converts it to RGB and lightens or darkens

		1. remove hash if present
		2. convert from 3 to 6 digit color code & ensure valid hex
		3. do fancy RGB bitwise operations
		4. combine back into a hex value
*/

function shadeColor (color, percent) {
	// 1.
	var hex = color.replace('#', '');

	// 2.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error(`Invalid color value provided: "${color}"`);
	}

	// 3.
	let f = parseInt(hex, 16);
	let t = percent < 0 ? 0 : 255;
	let p = percent < 0 ? percent * -1 : percent;

	const R = f >> 16;
	const G = f >> 8 & 0x00FF;
	const B = f & 0x0000FF;

	// 4.
	return '#' + (0x1000000
		+ (Math.round((t - R) * p) + R) * 0x10000
		+ (Math.round((t - G) * p) + G) * 0x100
		+ (Math.round((t - B) * p) + B)).toString(16).slice(1);
};

module.exports = {
	fadeColor,
	shadeColor,
};
