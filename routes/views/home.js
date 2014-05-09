var keystone = require('../../');

exports = module.exports = function(req, res) {

	keystone.render(req, res, 'home', {
		section: 'home',
		page: 'home',
		orphanedLists: keystone.getOrphanedLists()
	});

};
