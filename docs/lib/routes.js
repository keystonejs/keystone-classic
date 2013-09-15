var _ = require('underscore'),
	content = require('../content/index.json');

function view(view) {
	return function(req, res, next) {
		res.render(view);
	}
}

exports = module.exports = function(app) {
	
	_.each(content, function(options, key) {
		
		app.get(options.path, view(options.template));
		
	});
	
}
