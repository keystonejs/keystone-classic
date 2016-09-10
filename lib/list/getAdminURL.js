/**
 * Gets the Admin URL to view the list (or an item if provided)
 *
 * Example:
 *     var listURL = list.getAdminURL()
 *     var itemURL = list.getAdminURL(item)
 *
 * @param {Object} item
 */
function getAdminURL (item) {
	return '/' + this.keystone.get('admin path') + '/' + this.path + (item ? '/' + item.id : '');
}

module.exports = getAdminURL;
