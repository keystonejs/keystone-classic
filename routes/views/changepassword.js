"use strict";
var keystone = require('../../');

module.exports = function(req, res) {
	function renderView() {
		keystone.render(req, res, 'changepassword', {
			submitted: req.body,
			from     : req.query.from,
			logo     : keystone.get('signin logo')
		});
	}

	if (req.method === 'POST') {
		if (!keystone.security.csrf.validate(req)) {
			req.flash('error', 'There was an error with your request, please try again.');
			return res.redirect(keystone.get('signin url'));
		}

		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Please enter a new password and confirmation');
			return renderView();
		}

		req.user.getUpdateHandler(req).process(req.body, {
			fields     : ["password"],
			flashErrors: true
		}, function(err, user) {
			if (err) {
				if (err.name !== "ValidationError") {
					req.flash('error', 'Could not update password');
				}
				renderView();
			} else {
				req.flash('success', 'Password changed successfully');
				res.redirect(keystone.get("changepassword redirect") || '/keystone');
			}

		});

	} else {
		keystone.user.attemptSignin(req.params.token, req, res, function(err, user) {
			if (err) {
				req.flash('error', 'Could not reset your password, maybe the link has expired.');
				return res.redirect(keystone.get("resetpassword url"));
			}
			req.flash('success', 'Password has been reset.');
			renderView();
		});
	}
};
