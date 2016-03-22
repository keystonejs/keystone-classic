/**
 * Registers or retrieves a list
 */

module.exports = function list (arg) {
	if (arg && arg.constructor === this.List) {
		this.lists[arg.key] = arg;
		this.paths[arg.path] = arg.key;
		return arg;
	}
	var result = this.lists[arg] || this.lists[this.paths[arg]];
	if (!result) throw new ReferenceError('Unknown keystone list ' + JSON.stringify(arg));
	return result;
};
