var keystone = require('../../../');

exports = module.exports = function(req, res) {

	keystone.render(req, res, 'home', {
    adminUri: keystone.get('admin uri'),
		section: 'home',
		page: 'home',
		title: keystone.get('name') || 'Keystone',
		orphanedLists: keystone.getOrphanedLists()
	});

};
