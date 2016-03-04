var keystone = require('../../../');
var _ = require('lodash');
var async = require('async');

module.exports = function getRelated (paths, callback, nocollapse) {

	var item = this;
	var list = this.list;
	var queue = {};

	if (typeof callback !== 'function') {
		throw new Error('List.getRelated(paths, callback, nocollapse) requires a callback function.');
	}

	if (typeof paths === 'string') {
		var pathsArr = paths.split(' ');
		var lastPath = '';
		paths = [];
		for (var i = 0; i < pathsArr.length; i++) {
			lastPath += (lastPath.length ? ' ' : '') + pathsArr[i];
			if (lastPath.indexOf('[') < 0 || lastPath.charAt(lastPath.length - 1) === ']') {
				paths.push(lastPath);
				lastPath = '';
			}
		}
	}

	_.forEach(paths, function (options) {

		var populateString = '';

		if (typeof options === 'string') {
			if (options.indexOf('[') > 0) {
				populateString = options.substring(options.indexOf('[') + 1, options.indexOf(']'));
				options = options.substr(0, options.indexOf('['));
			}
			options = { path: options };
		}
		options.populate = options.populate || [];
		options.related = options.related || [];

		var relationship = list.relationships[options.path];
		if (!relationship) throw new Error('List.getRelated: list ' + list.key + ' does not have a relationship ' + options.path + '.');

		var refList = keystone.list(relationship.ref);
		if (!refList) throw new Error('List.getRelated: list ' + relationship.ref + ' does not exist.');

		var relField = refList.fields[relationship.refPath];
		if (!relField || relField.type !== 'relationship') throw new Error('List.getRelated: relationship ' + relationship.ref + ' on list ' + list.key + ' refers to a path (' + relationship.refPath + ') which is not a relationship field.');

		if (populateString.length) {

			_.forEach(populateString.split(' '), function (key) {
				if (refList.relationships[key]) {
					options.related.push(key);
				} else {
					options.populate.push(key);
				}
			});

		}

		queue[relationship.path] = function (done) {

			var query = refList.model.find().where(relField.path);

			if (options.populate) {
				query.populate(options.populate);
			}

			if (relField.many) {
				query.in([item.id]);
			} else {
				query.equals(item.id);
			}

			query.sort(options.sort || relationship.sort || refList.defaultSort);

			if (options.related.length) {
				query.exec(function (err, results) {
					if (err || !results.length) {
						return done(err, results);
					}
					async.parallel(results.map(function (item) {
						return function (done) {
							item.populateRelated(options.related, done);
						};
					}),
						function (err) {
							done(err, results);
						}
					);
				});
			} else {
				query.exec(done);
			}

		};

		if (!item._populatedRelationships) item._populatedRelationships = {};
		item._populatedRelationships[relationship.path] = true;

	});

	async.parallel(queue, function (err, results) {
		if (!nocollapse && results && paths.length === 1) {
			results = results[paths[0]];
		}
		callback(err, results);
	});

};
