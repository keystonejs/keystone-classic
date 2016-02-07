/**
 * Gets and Sets list options. Aliased as .get()
 *
 * Example:
 *     list.set('test') // returns the 'test' value
 *     list.set('test', value) // sets the 'test' option to `value`
 */
function set (key, value) {
	if (arguments.length === 1) {
		return this.options[key];
	}
	this.options[key] = value;
	return value;
}

module.exports = set;
