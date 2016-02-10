var keystone = require('../../../../');
var Get = require('../list/get');

module.exports = function (req, res) {
	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to reorder ' + req.list.key + ' ' + req.params.id + '; CSRF failure');
		return res.apiError(403, 'invalid csrf');
	}
	req.list.model.reorderItems(req.params.id, req.params.sortOrder, req.params.newOrder, function (err, doc) {
		if (err) return res.apiError('database error', err);
		return Get(req, res);
	});
};
