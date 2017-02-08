/*
TODO: Needs Review and Spec
*/

var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	// var updateCount = 0;
	async.map(req.body.items, function (data, done) {
		req.list.model.findById(data.id, function (err, item) {
			if (err) return done({ statusCode: 500, error: 'database error', detail: err, id: data.id });
			if (!item) return done({ statusCode: 404, error: 'not found', id: data.id });
			req.list.updateItem(item, data, { files: req.files, user: req.user }, function (err) {
				if (err) {
					err.id = data.id;
					// validation errors send http 400; everything else sends http 500
					err.statusCode = err.error === 'validation errors' ? 400 : 500;
					return done(err);
				}
				// updateCount++;
				done(null, req.query.returnData ? req.list.getData(item) : item.id);
			});
		});
	}, function (err, results) {
		if (err) {
			if (err.statusCode) {
				res.status(err.statusCode);
				delete err.statusCode;
			}
			return res.json(err);
		}
		res.json({
			success: true,
			items: results,
		});
	});
};
