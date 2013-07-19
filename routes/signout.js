var prospekt = require('../'),
	session = require('../lib/session');

exports = module.exports = function(req, res) {
	
	session.signout(req, res, function() {
		prospekt.render(req, res, 'signout');
	});
	
}