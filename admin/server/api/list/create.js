module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}

	var item = new req.list.model();
	req.list.validateInput(item, req.body, function (err) {
		if (err) return res.status(400).json(err);
		req.list.updateItem(item, req.body, { files: req.files }, function (err) {
			if (err) return res.status(500).json(err);
			res.json(req.list.getData(item));
		});
	});
};
