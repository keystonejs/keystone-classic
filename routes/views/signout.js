var keystone = require('../../'),
	session = require('../../lib/session');

exports = module.exports = function(req, res) {
	
	session.signout(req, res, function() {
		
		if ('string' == typeof keystone.get('signout redirect')) {
			res.redirect(keystone.get('signout redirect'));
		} else if ('function' == typeof keystone.get('signout redirect')) {
			keystone.get('signout redirect')(req, res);
		} else {
			res.redirect('/keystone');
		}
		
		keystone.render(req, res, 'signout', {
			logo: keystone.get('signin logo')
		});
	});
	
}
