var utils = require('../../../utils');

module.exports = function DateType(config) {
	var self = {
		selector: '.field-type-date[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'input[name="' + config.fieldName + '"]',
			todayButton: '.Button--default',
		},
		commands: [{
			assertUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@value').to.be.visible;
				this
					.expect.element('@todayButton').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this
					.clearValue('@value')
					.setValue('@value', input.value);
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
