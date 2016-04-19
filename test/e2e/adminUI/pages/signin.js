module.exports = {
	elements: {
		emailInput: {
			selector: 'input[name=email]',
		},
		passwordInput: {
			selector: 'input[name=password]',
		},
		submitButton: {
			selector: 'button[type=submit]',
		},
	},
	commands: [{
		signin: function () {
			return this
				.setValue('@emailInput', 'test@test.e2e')
				.setValue('@passwordInput', 'test')
				.click('@submitButton');
		},
	}],
};
