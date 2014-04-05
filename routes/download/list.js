var keystone = require('../../'),
	_ = require('underscore'),
	async = require('async'),
	csv = require('csv');

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

exports = module.exports = function(req, res) {
	
	var filters = (req.query.q) ? req.list.processFilters(req.query.q) : {},
		queryFilters = req.list.getSearchFilters(req.query.search, filters);
	
	req.list.model.find(queryFilters).exec(function(err, results) {
		
		var columns = ['id'];
		
		if (req.list.get('autokey')) {
			columns.push(req.list.get('autokey').path);
		}
		
		_.each(req.list.fields, function(field) {
			columns.push(field.path);
		});
		
		var sendCSV = function(data) {
			csv().from(data).to(res.attachment(req.list.path + '.csv'), {
				header: true,
				columns: columns
			});
		}
		
		if (!results.length) {
			return sendCSV([]);
		}
		
		if (results[0].toCSV) {
			
			/**
			 * Custom toCSV Method present
			 * 
			 * Detect dependencies and call it. If the last dependency is `callback`, call it asynchronously.
			 * 
			 * Support dependencies are:
			 *   - req (current express request object)
			 *   - user (currently authenticated user)
			 *   - callback (invokes async mode, must be provided last)
			 */
			
			var deps = _.map(results[0].toCSV.toString().match(FN_ARGS)[1].split(','), function(i) { return i.trim() });
			
			var map = {
				req: req,
				user: req.user
			};
			
			var applyDeps = function(fn, _this, _map) {
				var args = _.map(deps, function(key) {
					return _map[key];
				});
				return fn.apply(_this, args);
			}
			
			if (_.last(deps) == 'callback') {
				// Allow async toCSV by detecting the last argument is callback
				return async.map(results, function(i, callback) {
					var _map = _.clone(map);
					_map.callback = callback;
					applyDeps(i.toCSV, i, _map);
				}, function(err, results) {
					if (err) {
						console.log('Error generating CSV for list ' + req.list.key);
						console.log(err);
						return res.send(keystone.wrapHTMLError('Error generating CSV', 'Please check the log for more details, or contact support.'));
					}
					sendCSV(results);
				});
			} else {
				// Without a callback, toCSV must return the value
				var data = [];
				_.each(results, function(i) {
					data.push(applyDeps(i.toCSV, i, map));
				});
				return sendCSV(data);
			}
			
		} else {
			
			/**
			 * Generic conversion to CSV
			 * 
			 * Loops through each of the fields in the List and uses each field's `format` method
			 * to generate the data
			 */
			
			var data = [];
			_.each(results, function(i) {
				
				var row = { id: i.id };
				
				if (req.list.get('autokey')) {
					row[req.list.get('autokey').path] = i.get(req.list.get('autokey').path);
				}
				
				_.each(req.list.fields, function(field) {
					if (field.type == 'boolean') {
						row[field.path] = i.get(field.path) ? 'true' : 'false';
					} else {
						row[field.path] = field.format(i);
					}
				});
				
				data.push(row);
				
			});
			return sendCSV(data);
		}
		
	});
	
}
