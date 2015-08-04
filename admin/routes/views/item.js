var keystone = require('../../../');
var _ = require('underscore');
var async = require('async');

exports = module.exports = function(req, res) {

	var itemQuery = req.list.model.findById(req.params.item).select();

	itemQuery.exec(function(err, item) {

		if (err) {
			req.flash('error', 'A database error occurred.');
			return res.redirect('/keystone/' + req.list.path);
		}

		if (!item) {
			req.flash('error', 'Item ' + req.params.item + ' could not be found.');
			return res.redirect('/keystone/' + req.list.path);
		}

		var renderView = function() {

			var relationships = _.values(_.compact(_.map(req.list.relationships, function(i) {
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

			}, function(err) { //eslint-disable-line no-unused-vars, handle-callback-err

				// TODO: Handle err

				var showRelationships = _.some(relationships, function(rel) {
					return rel.items.results.length;
				});

				var appName = keystone.get('name') || 'Keystone';

				keystone.render(req, res, 'item', {
					section: keystone.nav.by.list[req.list.key] || {},
					title: appName + ': ' + req.list.singular + ': ' + req.list.getDocumentName(item),
					page: 'item',
					list: req.list,
					item: item,
					relationships: relationships,
					showRelationships: showRelationships
				});

			});

		};

		if (req.method === 'POST' && req.body.action === 'updateItem' && !req.list.get('noedit')) {

			if (!keystone.security.csrf.validate(req)) {
				console.error('CSRF failure', req.method, req.body);
				req.flash('error', 'There was a problem with your request, please try again.');
				return renderView();
			}

			item.getUpdateHandler(req).process(req.body, { flashErrors: true, logErrors: true }, function(err) {
				if (err) {
					return renderView();
				}
				req.flash('success', 'Your changes have been saved.');
				return res.redirect('/keystone/' + req.list.path + '/' + item.id);
			});


		} else {
			renderView();
		}

	});

};
