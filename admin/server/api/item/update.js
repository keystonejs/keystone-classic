module.exports = function (req, res) {
	req.list.model.findById(req.params.id, function (err, item) {
		if (err) return res.status(500).json({ err: 'database error', detail: err });
		if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });
		var data = Object.assign({}, req.body, req.files);
		req.list.updateItem(item, data, function (err) {
			if (err) return res.status(500).json(err);
			res.json(req.list.getData(item));
		});
	});
};
