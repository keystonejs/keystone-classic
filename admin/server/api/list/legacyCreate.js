var keystone = require('../../../../');

module.exports = function (req, res) {
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	var item = new req.list.model();
	item.getUpdateHandler(req).process(req.body, { flashErrors: false, logErrors: true }, function (err) {
		if (err) {
			if (err.name === 'ValidationErrors') {
				return res.apiError(400, 'validation errors', err.errors);
			} else {
				return res.apiError(500, 'error', err);
			}
		}
		res.json(req.list.getData(item));
	});
};
