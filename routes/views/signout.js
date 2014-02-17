var keystone = require('../../'),
	session = require('../../lib/session');

exports = module.exports = function(req, res) {
	
	session.signout(req, res, function() {
		keystone.render(req, res, 'signout', {
			logo: keystone.get('signin logo')
		});
	});
	
}
