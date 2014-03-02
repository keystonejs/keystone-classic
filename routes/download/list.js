var keystone = require('../../'),
	_ = require('underscore'),
	csv = require('csv');

exports = module.exports = function(req, res) {
	
	var filters = (req.query.q) ? req.list.processFilters(req.query.q) : {},
		queryFilters = req.list.getSearchFilters(req.query.search, filters);
	
	req.list.model.find(queryFilters).exec(function(err, results) {
		
		var columns = ['id'],
			data = [];
		
		if (req.list.get('autokey')) {
			columns.push(req.list.get('autokey').path);
		}
		
		_.each(req.list.fields, function(field) {
			columns.push(field.path);
		});
		
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
		
		csv().from(data).to(res.attachment(req.list.path + '.csv'), {
			header: true,
			columns: columns
		});
		
	});
	
}
