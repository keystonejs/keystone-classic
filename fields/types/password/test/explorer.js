module.exports = {
	Field: require('../PasswordField'),
	Filter: require('../PasswordFilter'),
	spec: {
		label: 'Password Field',
		path: 'password',
		paths: {
			confirm: 'password_confirm',
		},
	},
	value: undefined,
};
