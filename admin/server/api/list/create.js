var keystone = require('../../../../');

module.exports = function(req, res) {
	if (!keystone.security.csrf.validate(req)) {
		console.log(`Refusing to create item; CSRF failure`);
		return res.apiError(403, 'invalid csrf');
	}
	if (req.list.get('nocreate')) {
		console.log(`Refusing to create item; List.nocreate is true`);
		return res.apiError(400, 'nocreate');
	}

	var data = req.body;
	var files = req.files;
	var item = new req.list.model();

	req.list.validateInput(item, {
		data: data,
		files: files,
	}, function(err, validationErrors) {
		if (Object.keys(validationErrors).length > 0) {
			// There were validation errors
			res.status(500).json({
				err: 'validation error',
				detail: {
					errors: validationErrors,
				},
			});
		} else {
			// There were no validation errors, create the new item
			req.list.updateItem(item, {
				data: data,
				files: files,
			}, function (err) {
				if (err) return res.status(500).json({ err: 'database error', detail: err });
				res.json(req.list.getData(item));
			});
		}
	});
};
