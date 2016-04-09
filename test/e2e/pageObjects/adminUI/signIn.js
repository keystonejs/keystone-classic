var spa = require('./spa');

module.exports = {
	url: spa.url,
	elements: {
		view: {
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
	commands: [{
		signin: function () {
			this.api.adminUI
                .waitForElementVisible('@signinView');

            this
                .setValue('@emailInput', 'test@test.e2e')
                .setValue('@passwordInput', 'test')
                .click('@submitButton');

			return this;
		},
	}],
}
