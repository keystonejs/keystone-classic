var keystone = require('../../../../');

module.exports = function(req, res) {
	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to delete ' + req.list.key + ' ' + req.params.id + '; CSRF failure');
		return res.apiError(403, 'invalid csrf');
	}
	if (req.list.get('nodelete')) {
		console.log('Refusing to delete ' + req.list.key + ' ' + req.params.id + '; List.nodelete is true');
		return res.apiError(403, 'nodelete');
	}
	if (req.user && req.params.id === req.user.id) {
		console.log('Refusing to delete ' + req.list.key + ' ' + req.params.id + '; item is current User');
		return res.apiError(403, 'not allowed', 'You can not delete yourself');
	}
	req.list.model.findById(req.params.id).exec(function (err, item) {
		if (err) {
			console.log('Error deleting ' + req.list.key + ' ' + req.params.id, err);
			return res.apiError('database error', err);
		}
		if (!item) {
			return res.apiError(404);
		}
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			return res.json({
				success: true,
				id: req.params.id
			});
		});
	});
};
