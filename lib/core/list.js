/**
 * Retrieves a list
 */

module.exports = function list (key) {
    var result;

    if (key)
    {
        result = this.lists[key] || this.lists[this.paths[key]];
    }
    else
    {
        result = this.lists;
    }

	if (!result) throw new ReferenceError('Unknown keystone list ' + JSON.stringify(key));

	return result;
};
