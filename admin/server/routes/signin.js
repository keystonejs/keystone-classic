var ejs = require('ejs');
var path = require('path');

var templatePath = path.resolve(__dirname, '../templates/signin.html');

module.exports = function SigninRoute (req, res) {
	var keystone = req.keystone;
	var UserList = keystone.list(keystone.get('user model'));
	var locals = {
		adminPath: '/' + keystone.get('admin path'),
		brand: keystone.get('brand'),
		csrf: { header: {} },
		logo: keystone.get('signin logo'),
		redirect: keystone.get('signin redirect'),
		user: req.user ? {
			id: req.user.id,
			name: UserList.getDocumentName(req.user) || '(no name)',
		} : undefined,
		userCanAccessKeystone: !!(req.user && req.user.canAccessKeystone),
	};
	locals.csrf.header[keystone.security.csrf.CSRF_HEADER_KEY] = keystone.security.csrf.getToken(req, res);
	ejs.renderFile(templatePath, locals, {}, function (err, str) {
		if (err) {
			console.error('Could not render Admin UI Signin Template:', err);
			return res.status(500).send(keystone.wrapHTMLError('Error Rendering Signin', err.message));
		}
		res.send(str);
	});
};
