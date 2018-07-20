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
		allowAll: keystone.get('ldap allow all') === false ? false : true,
		allowAllFrom: keystone.get('ldap allow all from') || '',
		allowUsers: keystone.get('ldap allow users') || [],
	};

	var ldapOptions = {
		url: keystone.get('ldap url'),
		searchBase: keystone.get('ldap base'),
		searchFilter: keystone.get('ldap filter'),
		reconnect: keystone.get('ldap reconnect'),
	};

	var auth = new ldap(ldapOptions);

	var User = keystone.list(keystone.get('user model'));

	auth.authenticate(req.body.email, req.body.password, function (err, ldapUser) {
		if (ldapUser) {

			var ldapUserDn = ldapUser.dn.replace(`cn=${ldapUser.cn},`, '');

			if ((ldapConfiguration.allowAll === true) || (ldapConfiguration.allowAllFrom.includes(ldapUserDn) === true) || (ldapConfiguration.allowUsers.includes(ldapUser.uid) === true)) {
				User.model.findOne({ email: ldapUser[ldapConfiguration.fields.email] }).exec(function (err, dbUser) {
					if (dbUser) {
						dbUser.name.first = ldapUser[ldapConfiguration.fields.name.first];
						dbUser.name.last = ldapUser[ldapConfiguration.fields.name.last];

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
								password: Math.random().toString(36).substring(7),
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
			} else {
				return res.status(500).json({
					error: 'your dn is not allowed to login on this server',
				});
			}

		} else if (err) {
			return res.status(500).json({ error: 'ldap error', details: err });
		} else {
			return res.status(401).json({ error: 'invalid details' });
		}
	});

}

module.exports = signinLdap;
