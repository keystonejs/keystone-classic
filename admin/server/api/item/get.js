var _ = require('lodash');
var async = require('async');
var listToArray = require('list-to-array');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var query = req.list.model.findById(req.params.id);

	var fields = req.query.fields;
	if (fields === 'false') {
		fields = false;
	}
	if (typeof fields === 'string') {
		fields = listToArray(fields);
	}
	if (fields && !Array.isArray(fields)) {
		return res.status(401).json({ error: 'fields must be undefined, a string, or an array' });
	}

	query.exec(function (err, item) {

		if (err) return res.status(500).json({ err: 'database error', detail: err });
		if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });

		var tasks = [];
		var drilldown;

		/* Drilldown (optional, provided if ?drilldown=true in querystring) */
		if (req.query.drilldown === 'true' && req.list.get('drilldown')) {
			drilldown = {
				def: req.list.get('drilldown'),
				items: [],
			};

			tasks.push(function (cb) {

				// TODO: proper support for nested relationships in drilldown

				// step back through the drilldown list and load in reverse order to support nested relationships
				drilldown.def = drilldown.def.split(' ').reverse();

				async.eachSeries(drilldown.def, function (path, done) {

					var field = req.list.fields[path];

					if (!field || field.type !== 'relationship') {
						throw new Error('Drilldown for ' + req.list.key + ' is invalid: field at path ' + path + ' is not a relationship.');
					}

					var refList = field.refList;

					if (field.many) {
						if (!item.get(field.path).length) {
							return done();
						}
						refList.model.find().where('_id').in(item.get(field.path)).limit(4).exec(function (err, results) {
							if (err || !results) {
								done(err);
							}
							var more = (results.length === 4) ? results.pop() : false;
							if (results.length) {
								// drilldown.data[path] = results;
								drilldown.items.push({
									list: refList.getOptions(),
									items: _.map(results, function (i) {
										return {
											label: refList.getDocumentName(i),
											href: '/' + keystone.get('admin path') + '/' + refList.path + '/' + i.id,
										};
									}),
									more: (more) ? true : false,
								});
							}
							done();
						});
					} else {
						if (!item.get(field.path)) {
							return done();
						}
						refList.model.findById(item.get(field.path)).exec(function (err, result) {
							if (result) {
								// drilldown.data[path] = result;
								drilldown.items.push({
									list: refList.getOptions(),
									items: [{
										label: refList.getDocumentName(result),
										href: '/' + keystone.get('admin path') + '/' + refList.path + '/' + result.id,
									}],
								});
							}
							done(err);
						});
					}

				}, function (err) {
					// put the drilldown list back in the right order
					drilldown.def.reverse();
					drilldown.items.reverse();
					cb(err);
				});

			});
		}

		/* Process tasks & return */
		async.parallel(tasks, function (err) {
			if (err) {
				return res.status(500).json({
					err: 'database error',
					detail: err,
				});
			}
			res.json(_.assign(req.list.getData(item, fields), {
				drilldown: drilldown,
			}));
		});
	});
};
