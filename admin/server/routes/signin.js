var keystone = require('../../../');
var signin = keystone.get('signin redirect') || 'signin';

module.exports = function (req, res) {
	if (signin !== 'signin') {
		res.redirect(signin);
	} else {
		keystone.render(req, res, signin, {
			submitted: req.body,
			from: req.query.from,
			logo: keystone.get('signin logo'),
		});
	};
};
