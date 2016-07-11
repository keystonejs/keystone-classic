module.exports = function SigninRoute (keystone) {
	return function (req, res) {
		keystone.render(req, res, 'signin', {
			submitted: req.body,
			from: req.query.from,
			redirect: keystone.get('signin redirect'),
			logo: keystone.get('signin logo'),
		});
	};
};
