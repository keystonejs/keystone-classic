var keystone = require('../../../');

module.exports = function(req, res) {
	keystone.render(req, res, 'signin', {
		submitted: req.body,
		from: req.query.from,
		logo: keystone.get('signin logo')
	});
};
