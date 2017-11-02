var ldap = require('ldapauth-fork');
var session = require('../../../../lib/session');

function signinLdap (req, res) {
	var keystone = req.keystone;

	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	if (!req.body.email || !req.body.password) {
		return res.status(401).json({ error: 'email and password required' });
	}

	var User = keystone.list(keystone.get('user model'));

	var ldapConfiguration = {
		allowUnregistered: keystone.get('ldap allow unregistered') || true,
		registerAsAdmin: keystone.get('ldap register as admin') || false,
		fields: {
			email: keystone.get('ldap field email') || 'mail',
			name: {
				first: keystone.get('ldap field name first') || 'givenName',
				last: keystone.get('ldap field name last') || 'sn',
			},
		},
	};

	var ldapOptions = {
		url: keystone.get('ldap url'),
		searchBase: keystone.get('ldap base'),
		searchFilter: keystone.get('ldap filter'),
		reconnect: keystone.get('ldap reconnect'),
	};

	var auth = new ldap(ldapOptions);

	auth.authenticate(req.body.email, req.body.password, function (err, ldapUser) {
		if (ldapUser) {
			User.model.findOne({ email: ldapUser[ldapConfiguration.email] }).exec(function (err, dbUser) {
				if (dbUser) {
					dbUser.name.first = ldapUser[ldapConfiguration.name.first];
					dbUser.name.last = ldapUser[ldapConfiguration.name.last];

					dbUser.save(function (err) {
						if (!err) {
							session.signinWithUser(dbUser, req, res, function () {
								keystone.callHook(dbUser, 'post:signin', function (err) {
									if (err) return res.status(500).json({ error: 'post:signin error', detail: err });
									res.json({ success: true, user: dbUser });
								});
							});
						} else {
							return res.status(500).json({ error: 'database error', detail: err });
						}
					});
				} else if (err) {
					return res.status(500).json({ error: 'database error', detail: err });
				} else {
					if (ldapConfiguration.allowUnregistered && ldapConfiguration.allowUnregistered === true) {
						var newUser = new User.model({
							email: ldapUser[ldapConfiguration.fields.email],
							name: {
								first: ldapUser[ldapConfiguration.fields.name.first],
								last: ldapUser[ldapConfiguration.fields.name.last],
							},
							isAdmin: ldapConfiguration.registerAsAdmin,
							password: req.body.password,
						});

						newUser.save((err) => {
							if (!err) {
								session.signinWithUser(newUser, req, res, function () {
									keystone.callHook(newUser, 'post:signin', function (err) {
										if (err) return res.status(500).json({ error: 'post:signin error', detail: err });
										res.json({ success: true, user: newUser });
									});
								});
							} else {
								return res.status(500).json({ error: 'database error', detail: err });
							}
						});
					} else {
						return res.status(401).json({ error: 'you are not allowed to register' });
					}


				}
			});
		} else if (err) {
			return res.status(500).json({ error: 'ldap error', details: err });
		} else {
			return res.status(401).json({ error: 'invalid details' });
		}
	});

}

module.exports = signinLdap;
