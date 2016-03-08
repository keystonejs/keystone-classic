var keystone = require('../../../');

module.exports = function (req, res) {
	var appName = keystone.get('name') || 'Keystone';
	require('../render')(req, res, 'index', {
		// section: keystone.nav.by.list[req.list.key] || {},
		title: appName,
		list: req.list,
		orphanedLists: keystone.getOrphanedLists(),
	});
};
