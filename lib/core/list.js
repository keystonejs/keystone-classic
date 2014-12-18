/**
 * Registers or retrieves a list
 */

function list(arg) {
	if (arg && arg.constructor === this.List) {
		this.lists[arg.key] = arg;
		this.paths[arg.path] = arg.key;
		return arg;
	}
	var ret = this.lists[arg] || this.lists[this.paths[arg]];
	if (!ret) throw new ReferenceError('Unknown keystone list ' + JSON.stringify(arg));
	return ret;
}

module.exports = list;
