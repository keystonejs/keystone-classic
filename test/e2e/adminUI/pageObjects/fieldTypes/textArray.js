var utils = require('../../../utils');

module.exports = function TextArrayType(config) {
	var self = {
		selector: '.field-type-textarray[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			addButton: '.Button--default',
			text1: '.FormField:nth-of-type(1) input[type="text"]',
			text2: '.FormField:nth-of-type(2) input[type="text"]',
			text1Delete: '.FormField:nth-of-type(1) .Button--link-cancel',
			text2Delete: '.FormField:nth-of-type(2) .Button--link-cancel',
		},
		commands: [{
			assertUI: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@addButton').to.be.visible;
				if (args !== undefined && args.textInputs !== undefined) {
					var self = this;
					args.textInputs.forEach(function(textInput) {
						self
							.expect.element('@' + textInput).to.be.visible;
						self
							.expect.element('@' + textInput + 'Delete').to.be.visible;
					});
				}
				return this;
			},
			fillInput: function(input) {
				textInputs = Object.keys(input);
				var self = this;
				textInputs.forEach(function(textInput) {
					self
						.clearValue('@' + textInput)
						.setValue('@' + textInput, input[textInput]);
				});
				return this;
			},
			assertInput: function(input) {
				textInputs = Object.keys(input);
				var self = this;
				textInputs.forEach(function(textInput) {
					self
						.getValue('@' + textInput, function (result) {
							self.api.assert.equal(result.state, "success");
							self.api.assert.equal(result.value, input[textInput]);
						});
				});
				return this;
			},
			addText: function() {
				this.click('@addButton');
				return this;
			},
		}],
	};

	return self;
};
