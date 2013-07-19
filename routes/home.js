var prospekt = require('../');

exports = module.exports = function(req, res) {
	
	prospekt.render(req, res, 'home', {
		section: 'home'
	});
	
}