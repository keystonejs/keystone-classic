/*
Deprecated.

This exists to support the legacy format of data submitted from the Admin UI,
which we are working to replace ASAP.
*/

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	var item = new req.list.model();
	item.getUpdateHandler(req).process(req.body, { flashErrors: false, logErrors: true, ignoreNoedit: true }, function (err) {
		if (err) {
			if (err.name === 'ValidationError' || err.name === 'ValidationErrors') {
				return res.apiError(400, 'validation errors', err.errors);
			} else {
				return res.apiError(500, 'error', err);
			}
		}
		res.json(req.list.getData(item));
	});
};
