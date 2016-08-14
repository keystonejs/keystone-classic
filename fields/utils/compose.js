/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

module.exports = function compose () {
	var funcs = Array.prototype.slice.call(arguments);
	if (funcs.length === 0) {
		return function (arg) { return arg; };
	}

	if (funcs.length === 1) {
		return funcs[0];
	}

	const last = funcs[funcs.length - 1];
	const rest = funcs.slice(0, -1);
	return function () {
		var args = Array.prototype.slice.call(arguments);
		return rest.reduceRight(function (composed, f) {
			return f(composed);
		}, last.apply(null, args));
	};
};
