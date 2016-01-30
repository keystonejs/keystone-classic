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
};
