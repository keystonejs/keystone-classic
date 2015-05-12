'use strict';
var keystone = require('../../');

module.exports = function(req, res) {
	function renderView(data) {
		keystone.render(req, res, 'changepassword', {
			user: data.user,
			reset: data.reset,
			submitted: req.body,
			from: req.query.from,
			logo: keystone.get('signin logo')
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
		
		if(!req.body.nonce){
			req.flash('error', 'Invalid request');
			return res.redirect(keystone.get('signin url'));
		}
		
		keystone.user.verifyResetToken(req.params.token, req.body.nonce, req, res, function(err, data) {
			if(err){
				req.flash('error', err);
				return res.redirect(keystone.get('signin url'));
			}
			data.user.getUpdateHandler(req).process(req.body, {
				fields: ['password'],
				flashErrors: true
			}, function(err, user) {
				if (err) {
					if (err.name !== 'ValidationError') {
						req.flash('error', 'Could not update password');
					}
					return res.redirect(keystone.get('signin url'));
				} else {
					keystone.session.signinWithUser(user, req, res, function(user) {
						req.flash('success', 'Password changed successfully');
						res.redirect(keystone.get('changepassword redirect') || '/keystone');
					});
				}
			});
		});
	} else {
		keystone.user.verifyResetToken(req.params.token, null, req, res, function(err, data) {
			if (err) {
				req.flash('error', 'Could not reset your password, maybe the link has expired.');
				return res.redirect(keystone.get('resetpassword url'));
			}
			req.flash('success', 'Password has been reset.');
			renderView(data);
		});
	}
};
