/**
 * Check whether or not a `path` is a reserved path. This restricts the use
 * of `Object.prototype` method keys as well as internal mongo paths.
 */

var reservedPaths = [
	'id',
	'_id',
	'_',
	'prototype',
	'__proto__',
	'hasOwnProperty',
	'toString',
	'__defineGetter__',
	'__defineSetter__',
	'__lookupGetter__',
	'__lookupSetter__',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'toLocaleString',
	'valueOf'
];

function isReserved (path) {
	return reservedPaths.indexOf(path) >= 0;
}

module.exports = isReserved;
