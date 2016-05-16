var utils = require('../../../utils');

module.exports = function DateArrayType(config) {
	var self = {
		selector: '.field-type-datearray[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			addButton: '.Button--default',
			date1: '#_DateInput_1',
			date2: '#_DateInput_2',
			date3: '#_DateInput_3',
			date4: '#_DateInput_4',
			date5: '#_DateInput_5',
			date6: '#_DateInput_6',
			date7: '#_DateInput_7',
			date8: '#_DateInput_8',
			date9: '#_DateInput_9',
			date10: '#_DateInput_10',
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
