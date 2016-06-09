var keystone = require('../../../');
var path = require('path');

module.exports = function (req, res) {
	var appName = keystone.get('name') || 'Keystone';
	var codemirrorPath = keystone.get('codemirror url path')
												? path.join('/', keystone.get('codemirror url path'))
												: path.join('/', keystone.get('admin path'), '/js/lib/codemirror');
	// ensure for windows :-)
	codemirrorPath = codemirrorPath.replace(/\\/g, '/');
	keystone.render(req, res, 'index', {
		// section: keystone.nav.by.list[req.list.key] || {},
		title: appName,
		list: req.list,
		orphanedLists: keystone.getOrphanedLists(),
		codemirrorPath: codemirrorPath,
	});
};
