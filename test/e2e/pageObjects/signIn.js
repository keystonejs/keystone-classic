var globals = require('../globals');

module.exports = {
	url: globals.adminUiUrl,
	elements: {
		container: {
			selector: '#signin-view'
		},
		emailInput: {
			selector: 'input[name=email]',
		},
		passwordInput: {
			selector: 'input[name=password]'
		},
		submitButton: {
			selector: 'button[type=submit]'
		},
	},
}
