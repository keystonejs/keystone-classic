var utils = require('../../../utils');

module.exports = function DateArrayType(config) {
	var self = {
		selector: '.field-type-datearray[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			addButton: '.Button--default',
			date1: '.FormField:nth-of-type(1) input[type="text"]',
			date2: '.FormField:nth-of-type(2) input[type="text"]',
			date1Delete: '.FormField:nth-of-type(1) .Button--link-cancel',
			date2Delete: '.FormField:nth-of-type(2) .Button--link-cancel',
		},
		commands: [{
			assertUI: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@addButton').to.be.visible;
				if (args !== undefined && args.dateInputs !== undefined) {
					var self = this;
					args.dateInputs.forEach(function(dateInput) {
						self
							.expect.element('@' + dateInput).to.be.visible;
						self
							.expect.element('@' + dateInput + 'Delete').to.be.visible;
					});
				}
				return this;
			},
			fillInput: function(input) {
				dateInputs = Object.keys(input);
				var self = this;
				dateInputs.forEach(function(dateInput) {
					self
						.clearValue('@' + dateInput)
						.setValue('@' + dateInput, input[dateInput]);
				});
				return this;
			},
			assertInput: function(input) {
				dateInputs = Object.keys(input);
				var self = this;
				dateInputs.forEach(function(dateInput) {
					self
						.getValue('@' + dateInput, function (result) {
							self.api.assert.equal(result.state, "success");
							self.api.assert.equal(result.value, input[dateInput]);
					});
				});
				return this;
			},
			addDate: function() {
				this.click('@addButton');
				return this;
			}
		}],
	};

	return self;
};
