var keystone = require('../../../');
var session = require('../../../lib/session');

module.exports = function(req, res) {
	session.signout(req, res, function() {
		if ('string' === typeof keystone.get('signout redirect')) {
			return res.redirect(keystone.get('signout redirect'));
		} else if ('function' === typeof keystone.get('signout redirect')) {
			return keystone.get('signout redirect')(req, res);
		} else {
			return res.redirect('/' + keystone.get('admin path') + '/signin?signedout');
		}
	});
};
