/**
 * Registers or retrieves a list
 */

module.exports = function(list) {
	if (list && list.constructor === this.List) {
		this.lists[list.key] = list;
		this.paths[list.path] = list.key;
		return list;
	}
	return this.lists[list] || this.lists[this.paths[list]];
};
