var keystone = require('../../../');
var session = require('../../../lib/session');

module.exports = function (req, res) {
	session.signout(req, res, function () {
		if (typeof keystone.get('signout redirect') === 'string') {
			return res.redirect(keystone.get('signout redirect'));
		} else if (typeof keystone.get('signout redirect') === 'function') {
			return keystone.get('signout redirect')(req, res);
		} else {
			return res.redirect('/' + keystone.get('admin path') + '/signin?signedout');
		}
	});
};
