module.exports = function(req, res) {
	var data = req.body;
	var files = req.files;

	req.list.model.findById(req.params.id, function(err, item) {
		if (err) return res.status(500).json({ err: 'database error', detail: err });
		if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });

		req.list.processFormData(item, {
			data: data,
			files: files,
		}, function(errors, item) {
			if (errors) {
				res.status(500).json({
					err: 'validation error',
					detail: {
						errors: errors,
					},
				});
			} else {
				res.json(req.list.getData(item));
			}
		});
	});
};
