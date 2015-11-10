exports = module.exports = function(keystone) {
	return function(req, res) {

		keystone.render(req, res, 'home', {
			section: 'home',
			page: 'home',
			title: keystone.get('name') || 'Keystone',
			orphanedLists: keystone.getOrphanedLists(),
			brand: keystone.get('name')
		});

	};
};
