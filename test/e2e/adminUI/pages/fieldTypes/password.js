var utils = require('../../../utils');

module.exports = function PasswordType(config) {
	var self = {
		selector: '.field-type-password[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'input[name="' + config.fieldName + '"]',
			confirmValue: 'input[name="' + config.fieldName + '_confirm"]',
			setPasswordButton: '.Button',
		},
		commands: [{
			clickSetPassword: function() {
				this
					.click('@setPasswordButton')
					.waitForElementVisible('@value');
				return this;
			},
			verifyUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@value').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this
					.clearValue('@value')
					.setValue('@value', input.value)
					.clearValue('@confirmValue')
					.setValue('@confirmValue', input.confirm)
				return this;
			},
			assertInput: function(input) {
				this
					.waitForElementVisible('@value');
				this
					.getValue('@value', function (result) {
						this.api.assert.equal(result.state, "success");
						this.api.assert.equal(result.value, input.value);
					});
				return this;
			},
		}],
	};

	return self;
};
