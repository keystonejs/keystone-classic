/**
 * Adds a method to the underscoreMethods collection on the list, which is then
 * added to the schema before the list is registered with mongoose.
 */
function underscoreMethod (path, fn) {
	var target = this.underscoreMethods;
	path = path.split('.');
	var last = path.pop();
	path.forEach(function (part) {
		if (!target[part]) target[part] = {};
		target = target[part];
	});
	target[last] = fn;
	return this;
}

module.exports = underscoreMethod;
