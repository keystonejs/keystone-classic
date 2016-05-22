var utils = require('../../../utils');

module.exports = function UrlType(config) {
	var self = {
		selector: '.field-type-relationship[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			placeholder: '.Select-placeholder',
			value: '.Select-value-label',
			arrow: '.Select-arrow-zone',
			clear: '.Select-clear-zone',
			option1: '.Select-option:nth-of-type(1)',
			option2: '.Select-option:nth-of-type(2)'
		},
		commands: [{
			assertUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@placeholder').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this
					.click('@arrow')
					.waitForElementVisible('@option1')
					.click('@' + input.option);
				return this;
			},
			assertInput: function(input) {
				this
					.waitForElementVisible('@value');
				this
					.getText('@value', function (result) {
						this.api.assert.equal(result.state, "success");
						this.api.assert.equal(result.value, input.value);
					});
				return this;
			},
		}],
	};

	return self;
};
