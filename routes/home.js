var prospekt = require('../');

exports = module.exports = function(req, res) {
	
	prospekt.render(req, res, 'home', {
		brand: prospekt.get('brand'),
		lists: prospekt.lists,
		section: 'home'
	});
	
}