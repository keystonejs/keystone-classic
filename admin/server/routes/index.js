var path = require('path');

module.exports = function IndexRoute (keystone) {
	return function (req, res) {
		var appName = keystone.get('name') || 'Keystone';
		var codemirrorPath = keystone.get('codemirror url path')
			? path.join('/', keystone.get('codemirror url path'))
			: path.join('/', keystone.get('admin path'), '/js/lib/codemirror');
		// ensure for windows :-)
		codemirrorPath = codemirrorPath.replace(/\\/g, '/');
		keystone.render(req, res, 'index', {
			title: appName,
			list: req.list,
			orphanedLists: keystone.getOrphanedLists(),
			codemirrorPath: codemirrorPath,
		});
	};
};
