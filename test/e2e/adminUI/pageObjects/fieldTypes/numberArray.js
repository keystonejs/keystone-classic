var utils = require('../../../utils');

module.exports = function NumberArrayType(config) {
	var self = {
		selector: '.field-type-numberarray[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			addButton: '.Button--default',
			number1: '.FormField:nth-of-type(1) input[type="text"]',
			number2: '.FormField:nth-of-type(2) input[type="text"]',
			number1Delete: '.FormField:nth-of-type(1) .Button--link-cancel',
			number2Delete: '.FormField:nth-of-type(2) .Button--link-cancel',
		},
		commands: [{
			assertUI: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@addButton').to.be.visible;
				if (args !== undefined && args.numberInputs !== undefined) {
					var self = this;
					args.numberInputs.forEach(function(numberInput) {
						self
							.expect.element('@' + numberInput).to.be.visible;
						self
							.expect.element('@' + numberInput + 'Delete').to.be.visible;
					});
				}
				return this;
			},
			fillInput: function(input) {
				numberInputs = Object.keys(input);
				var self = this;
				numberInputs.forEach(function(numberInput) {
					self
						.clearValue('@' + numberInput)
						.setValue('@' + numberInput, input[numberInput]);
				});
				return this;
			},
			assertInput: function(input) {
				numberInputs = Object.keys(input);
				var self = this;
				numberInputs.forEach(function(numberInput) {
					self
						.getValue('@' + numberInput, function (result) {
							self.api.assert.equal(result.state, "success");
							self.api.assert.equal(result.value, input[numberInput]);
						});
				});
				return this;
			},
			addNumber: function() {
				this.click('@addButton');
				return this;
			},
		}],
	};

	return self;
};
