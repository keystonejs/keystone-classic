var prospekt = require('../'),
	_ = require('underscore'),
	cloudinary = require('cloudinary'),
	moment = require('moment'),
	image = require('../lib/image');

exports = module.exports = function(req, res) {
	
	var sendResponse = function(status) {
		res.json(status);
	};
	
	var sendError = function(key, err, msg) {
		msg = msg || 'Error';
		key = key || 'unknown error';
		msg += ' (' + key + ')';
		console.log(msg + (err ? ':' : ''));
		if (err) {
			console.log(err);
		}
		res.status(500);
		sendResponse({ error: key || 'error', detail: err });
	};
	
	switch (req.params.action) {
		
		case 'get':
			
			req.list.model.findById(req.query.id).exec(function(err, item) {
				
				if (err) return sendError('database error', err);
				
				if (!item) return sendError('not found');
				
				switch (req.query.dataset) {
					case 'simple':
						return sendResponse({
							name: req.list.getItemName(item),
							id: item.id
						});
					break;
					default:
						return sendResponse(item);
				}
			});
			
		break;
		
		case 'autocomplete':
			
			var limit = req.query.limit || 10,
				page = req.query.page || 1,
				skip = limit * (page - 1);
			
			var query = req.list.model.find(req.list.getSearchFilters(req.query.q));
			
			query.limit(limit)
				.skip(skip)
				.sort(req.list.defaultSort)
				.exec(function(err, items) {
					
					if (err) return sendError('database error', err);
					
					query.count(function(err, total) {
						
						if (err) return sendError('database error', err);
						
						sendResponse({
							total: total,
							items: items.map(function(i) {
								return {
									name: req.list.getItemName(i),
									id: i.id
								};
							})
						});
						
					});
					
					
				});
		break;
	}
	
};