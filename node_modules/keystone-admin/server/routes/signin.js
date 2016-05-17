var keystone = require('keystone');

module.exports = function (req, res) {
	require('../render')(req, res, 'signin', {
		submitted: req.body,
		from: req.query.from,
		redirect: keystone.get('signin redirect'),
		logo: keystone.get('signin logo'),
	});

};
