var keystone = require('../../');

exports = module.exports = function(req, res) {

	var infoMessage = 'If we found a corresponding user, you\'ll receive an email with instructions on how to reset your password';

	function renderView() {
		keystone.render(req, res, 'resetpassword', {
			submitted: req.body,
			from     : req.query.from,
			logo     : keystone.get('signin logo')
		});
	}

if (req.method === 'POST') {

		if (!keystone.security.csrf.validate(req)) {
			req.flash('error', 'There was an error with your request, please try again.');
			return renderView();
		}

		if (!req.body.email) {
			req.flash('error', 'Please enter your email address.');
			return renderView();
		}

		var genericMessage = function() {
			req.flash('success', infoMessage);
			renderView();
		};

		keystone.user.attemptReset(req.body, function(err) {
			if (err) {
				req.flash('error', 'There was an error with your request, please try again.');
			} else {
				req.flash('success', infoMessage);
			}
			return renderView();
		});

	} else {
		renderView();
	}

};
