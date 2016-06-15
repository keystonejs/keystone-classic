/**
 * Check whether or not a `path` is a reserved path. This restricts the use
 * of `Object.prototype` method keys as well as internal mongo paths.
 */

var reservedPaths = [
	'_',
	'__defineGetter__',
	'__defineSetter__',
	'__lookupGetter__',
	'__lookupSetter__',
	'__proto__',
	'_id',
	'hasOwnProperty',
	'id',
	'isPrototypeOf',
	'list',
	'propertyIsEnumerable',
	'prototype',
	'toLocaleString',
	'toString',
	'valueOf',
];

function isReserved (path) {
	return reservedPaths.indexOf(path) >= 0;
}

module.exports = isReserved;
