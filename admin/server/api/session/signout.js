function signout (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	var user = req.user;
	keystone.callHook(user, 'pre:signout', function (err) {
		if (err) return res.status(500).json({ error: 'pre:signout error', detail: err });
		res.clearCookie('keystone.uid');
		req.user = null;
		req.session.regenerate(function (err) {
			if (err) return res.status(500).json({ error: 'session error', detail: err });
			keystone.callHook(user, 'post:signout', function (err) {
				if (err) return res.status(500).json({ error: 'post:signout error', detail: err });
				res.json({ success: true });
			});
		});
	});
}

module.exports = signout;
