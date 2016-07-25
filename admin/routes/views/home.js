exports = module.exports = function(req, res) {

	var keystone = req.keystone;
	
	keystone.render(req, res, 'home', {
		section: 'home',
		page: 'home',
		title: keystone.get('name') || 'Keystone',
		orphanedLists: keystone.getOrphanedLists()
	});

};
