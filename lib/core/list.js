/**
 * Registers or retrieves a list
 */

Keystone.prototype.list = function(list) {
	if (list && list.constructor === this.List) {
		this.lists[list.key] = list;
		this.paths[list.path] = list.key;
		return list;
	}
	return this.lists[list] || this.lists[this.paths[list]];
};
