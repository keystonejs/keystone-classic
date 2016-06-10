/**
 * Retrieves a list
 */

module.exports = function list (key) {
	var result = this.lists[key] || this.lists[this.paths[key]];
	if (!result) throw new ReferenceError('Unknown keystone list ' + JSON.stringify(key));
	return result;
};
