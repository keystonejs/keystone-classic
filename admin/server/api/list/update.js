var async = require('async');
var keystone = require('../../../../');

module.exports = function (req, res) {
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	var updateCount = 0;
	async.map(req.body.items, function (data, done) {
		req.list.model.findById(data.id, function (err, item) {
			if (err) return done({ statusCode: 500, err: 'database error', detail: err, id: data.id });
			if (!item) return done({ statusCode: 404, err: 'not found', id: data.id });
			req.list.validateInput(item, data, function (err) {
				if (err) {
					err.id = data.id;
					err.statusCode = 400;
					return done(err);
				}
				req.list.updateItem(item, data, function (err) {
					if (err) {
						err.id = data.id;
						err.statusCode = 500;
						return done(err);
					}
					updateCount++;
					done(null, req.query.returnData ? req.list.getData(item) : item.id);
				});
			});
		});
	}, function (err, results) {
		if (err) {
			if (err.statusCode) {
				res.status(err.statusCode);
				delete err.statusCode;
			}
			res.json(err);
		}
		res.json({
			success: true,
			items: results,
		});
	});
};
