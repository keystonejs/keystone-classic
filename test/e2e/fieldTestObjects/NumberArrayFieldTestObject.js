var utils = require('../utils');

module.exports = function NumberArrayFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
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
		commands: {
			clickUI: function (browser, elem) {
				browser.click(selectElem(elem));
			},
			assertUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('addButton')).to.be.visible;
				if (args !== undefined && args.numberInputs !== undefined) {
					args.numberInputs.forEach(function(numberInput) {
						browser
							.expect.element(selectElem(numberInput)).to.be.visible;
						browser
							.expect.element(selectElem(numberInput + 'Delete')).to.be.visible;
					});
				}
			},
			assertUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('addButton')).to.not.be.visible;
				if (args !== undefined && args.numberInputs !== undefined) {
					args.numberInputs.forEach(function(numberInput) {
						browser
							.expect.element(selectElem(numberInput)).to.not.be.visible;
						browser
							.expect.element(selectElem(numberInput + 'Delete')).to.not.be.visible;
					});
				}
			},
			assertUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('addButton')).to.be.present;
				if (args !== undefined && args.numberInputs !== undefined) {
					args.numberInputs.forEach(function(numberInput) {
						browser
							.expect.element(selectElem(numberInput)).to.be.present;
						browser
							.expect.element(selectElem(numberInput + 'Delete')).to.be.present;
					});
				}
			},
			assertUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('addButton')).to.not.be.present;
				if (args !== undefined && args.numberInputs !== undefined) {
					args.numberInputs.forEach(function(numberInput) {
						browser
							.expect.element(selectElem(numberInput)).to.not.be.present;
						browser
							.expect.element(selectElem(numberInput + 'Delete')).to.not.be.present;
					});
				}
			},
			fillInput: function(browser, input) {
				numberInputs = Object.keys(input);
				numberInputs.forEach(function(numberInput) {
					browser
						.clearValue(selectElem(numberInput))
						.setValue(selectElem(numberInput), input[numberInput]);
				});
			},
			assertInput: function(browser, input) {
				numberInputs = Object.keys(input);
				numberInputs.forEach(function(numberInput) {
					browser
						.getValue(selectElem(numberInput), function (result) {
							browser.api.assert.equal(result.state, "success");
							browser.api.assert.equal(result.value, input[numberInput]);
						});
				});
			},
		},
	};

	return self;
};
