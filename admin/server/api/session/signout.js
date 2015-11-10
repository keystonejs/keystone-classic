exports = module.exports = function(callHook) { 
	return function signout (req, res) {
		var user = req.user;
		callHook(user, 'pre:signout', function(err) {
			if (err) return res.json({ error: 'pre:signout error', detail: err });
			res.clearCookie('keystone.uid');
			req.user = null;
			req.session.regenerate(function(err) {
				if (err) return res.json({ error: 'session error', detail: err });
				callHook(user, 'post:signout', function(err) {
					if (err) return res.json({ error: 'pre:signout error', detail: err });
					res.json({ success: true });
				});
			});
		});
	};
};
