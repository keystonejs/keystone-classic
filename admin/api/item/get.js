var _ = require('underscore');
var async = require('async');
var keystone = require('../../../');

module.exports = function(req, res) {

	var query = req.list.model.findById(req.params.id);

	var fields = req.query.fields;
	if (req.query.basic !== undefined) {
		fields = false;
	}

	if (req.list.tracking && req.list.tracking.createdBy) {
		query.populate(req.list.tracking.createdBy);
	}

	if (req.list.tracking && req.list.tracking.updatedBy) {
		query.populate(req.list.tracking.updatedBy);
	}

	query.exec(function(err, item) {

		if (err) return res.status(500).json({ err: 'database error', detail: err });
		if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });

		var tasks = [];
		var drilldown;
		var relationships;

		/* Drilldown (optional, provided if ?drilldown=true in querystring) */
		if (req.query.drilldown === 'true' && req.list.get('drilldown')) {
			drilldown = {
				def: req.list.get('drilldown'),
				items: []
			};

			tasks.push(function(cb) {

				// TODO: proper support for nested relationships in drilldown
				
				// step back through the drilldown list and load in reverse order to support nested relationships
				drilldown.def = drilldown.def.split(' ').reverse();

				async.eachSeries(drilldown.def, function(path, done) {

					var field = req.list.fields[path];

					if (!field || field.type !== 'relationship') {
						throw new Error('Drilldown for ' + req.list.key + ' is invalid: field at path ' + path + ' is not a relationship.');
					}

					var refList = field.refList;

					if (field.many) {
						if (!item.get(field.path).length) {
							return done();
						}
						refList.model.find().where('_id').in(item.get(field.path)).limit(4).exec(function(err, results) {
							if (err || !results) {
								done(err);
							}
							var more = (results.length === 4) ? results.pop() : false;
							if (results.length) {
								// drilldown.data[path] = results;
								drilldown.items.push({
									list: refList.getOptions(),
									items: _.map(results, function(i) {
										return {
											label: refList.getDocumentName(i),
											href: '/keystone/' + refList.path + '/' + i.id
										};
									}),
									more: (more) ? true : false
								});
							}
							done();
						});
					} else {
						if (!item.get(field.path)) {
							return done();
						}
						refList.model.findById(item.get(field.path)).exec(function(err, result) {
							if (result) {
								// drilldown.data[path] = result;
								drilldown.items.push({
									list: refList.getOptions(),
									items: [{
										label: refList.getDocumentName(result),
										href: '/keystone/' + refList.path + '/' + result.id
									}]
								});
							}
							done(err);
						});
					}

				}, function(err) {
					// put the drilldown list back in the right order
					drilldown.def.reverse();
					drilldown.items.reverse();
					cb(err);
				});

			});
		}

		/* Relationships (optional, provided if ?relationships=true in querystring) */

		if (req.query.relationships === 'true') {
			tasks.push(function(cb) {

				relationships = _.values(_.compact(_.map(req.list.relationships, function(i) {
					if (i.isValid) {
						return _.clone(i);
					} else {
						keystone.console.err('Relationship Configuration Error', 'Relationship: ' + i.path + ' on list: ' + req.list.key + ' links to an invalid list: ' + i.ref);
						return null;
					}
				})));

				async.each(relationships, function(rel, done) {

					// TODO: Handle invalid relationship config
					rel.list = keystone.list(rel.ref);
					rel.sortable = (rel.list.get('sortable') && rel.list.get('sortContext') === req.list.key + ':' + rel.path);

					// TODO: Handle relationships with more than 1 page of results
					var q = rel.list.paginate({ page: 1, perPage: 100 })
						.where(rel.refPath).equals(item.id)
						.sort(rel.list.defaultSort);

					// rel.columns = _.reject(rel.list.defaultColumns, function(col) { return (col.type == 'relationship' && col.refList == req.list) });
					rel.columns = rel.list.defaultColumns;
					rel.list.selectColumns(q, rel.columns);

					q.exec(function(err, results) {
						rel.items = results;
						done(err);
					});

				}, cb);
			});
		}

		/* Process tasks & return */
		async.parallel(tasks, function(err) {
			if (err) {
				return res.status(500).json({
					err: 'database error',
					detail: err
				});
			}
			res.json(_.assign(req.list.getData(item, fields), {
				drilldown: drilldown,
				relationships: relationships
			}));
		});
	});
};
