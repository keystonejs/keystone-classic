var keystone = require('../../'),
	_ = require('underscore'),
	csv = require('csv');

exports = module.exports = function(req, res) {
	
	req.list.model.find().exec(function(err, results) {
		
		var columns = ['id'],
			data = [];
		
		_.each(req.list.fields, function(field) {
			columns.push(field.path);
		});
		
		_.each(results, function(i) {
			var row = { id: i.id };
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
