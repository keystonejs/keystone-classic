module.exports = {
	Field: require('../PasswordField'),
	Filter: require('../PasswordFilter'),
	section: 'Miscellaneous',
	spec: {
		label: 'Password',
		path: 'password',
		paths: {
			confirm: 'password_confirm',
		},
		value: undefined,
	},
};
