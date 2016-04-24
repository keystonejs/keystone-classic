var utils = require('../../../utils');

module.exports = function TextType(fieldName) {
	return  {
		selector: '.field-type-text[for="' + fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'input[name="' + fieldName + '"]',
		},
		commands: [{
			verifyUI: function () {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(fieldName));
				this
					.expect.element('@value').to.be.visible;
				return this;
			},
			fillInput: function (input) {
				this
					.clearValue('@value')
					.setValue('@value', input.value);
				return this;
			},
			verifyInput: function (input) {
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
};
