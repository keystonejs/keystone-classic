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
			assertUI: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				if (args.editForm){
					// In the edit form, a "Set Password" button is shown.
					this
						.expect.element('@setPasswordButton').to.be.visible;
				} else {
					// In the initial form, the input field is shown immediately.
					this
						.expect.element('@value').to.be.visible;
				}
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
					}.bind(this));
				return this;
			},
		}],
	};

	return self;
};
