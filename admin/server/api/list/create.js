// var keystone = require('../../../../');

module.exports = function(req, res) {
	// if (!keystone.security.csrf.validate(req)) {
	//	 console.log(`Refusing to create item; CSRF failure`);
	//	 return res.apiError(403, 'invalid csrf');
	// }
	if (req.list.get('nocreate')) {
		console.log(`Refusing to create item; List.nocreate is true`);
		return res.apiError(400, 'nocreate');
	}
	var item = new req.list.model();
	req.list.updateItem(item, {
		data: req.body,
		files: req.files,
	}, function (err) {
		if (err) return res.status(500).json({ err: 'database error', detail: err });
		res.json(req.list.getData(item));
	});
};
