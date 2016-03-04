var assign = require('object-assign');
var keystone = require('../../../../');

module.exports = function (req, res) {
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	req.list.model.findById(req.params.id, function (err, item) {
		if (err) return res.status(500).json({ err: 'database error', detail: err });
		if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });
		var data = assign({}, req.body, req.files);
		req.list.validateInput(item, data, function (err) {
			if (err) return res.status(400).json(err);
			req.list.updateItem(item, data, function (err) {
				if (err) return res.status(500).json(err);
				res.json(req.list.getData(item));
			});
		});
	});
};
