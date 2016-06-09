var utils = require('../../../utils');

module.exports = function NameType(config) {
	var self = {
		selector: '.field-type-name[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			firstName: 'input[name="' + config.fieldName + '.first"]',
			firstNamePlaceholder: 'input[placeholder="First name"]',
			lastName: 'input[name="' + config.fieldName + '.last"]',
			lastNamePlaceholder: 'input[placeholder="Last name"]',
		},
		commands: [{
			assertUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@firstName').to.be.visible;
				this
					.expect.element('@firstNamePlaceholder').to.be.visible;
				this
					.expect.element('@lastName').to.be.visible;
				this
					.expect.element('@lastNamePlaceholder').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this
					.clearValue('@firstName')
					.setValue('@firstName', input.firstName)
					.clearValue('@lastName')
					.setValue('@lastName', input.lastName);
				return this;
			},
			assertInput: function(input) {
				this
					.getValue('@firstName', function(result) {
						this.api.assert.equal(result.value, input.firstName);
					});
				this
					.getValue('@lastName', function(result) {
						this.api.assert.equal(result.value, input.lastName);
					});
				return this;
			},
		}],
	};

	return self;
};
