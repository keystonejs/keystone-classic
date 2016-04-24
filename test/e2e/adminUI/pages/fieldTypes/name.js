var utils = require('../../../utils');

module.exports = function NameType(fieldName) {
	return  {
		selector: '.field-type-name[for="' + fieldName + '"]',
		elements: {
			label: '.FormLabel',
			firstName: 'input[name="' + fieldName + '.first"]',
			firstNamePlaceholder: 'input[placeholder="First name"]',
			lastName: 'input[name="' + fieldName + '.last"]',
			lastNamePlaceholder: 'input[placeholder="Last name"]',
		},
		commands: [{
			verifyUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(fieldName));
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
			verifyInput: function(input) {
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
};
