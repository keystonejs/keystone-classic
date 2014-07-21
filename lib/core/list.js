/**
 * Registers or retrieves a list
 */

function list(arg) {
	if (arg && arg.constructor === this.List) {
		this.lists[arg.key] = arg;
		this.paths[arg.path] = arg.key;
		return arg;
	}
	return this.lists[arg] || this.lists[this.paths[arg]];
};

module.exports = list;
