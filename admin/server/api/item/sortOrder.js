/*
TODO: Needs Review and Spec
*/

var getList = require('../list/get');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to reorder ' + req.list.key + ' ' + req.params.id + '; CSRF failure');
		return res.apiError(403, 'invalid csrf');
	}
	req.list.model.reorderItems(req.params.id, req.params.sortOrder, req.params.newOrder, function (err) {
		if (err) return res.apiError('database error', err);
		return getList(req, res);
	});
};
