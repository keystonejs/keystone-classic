var utils = require('../utils');

module.exports = function DateArrayFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
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
				if (args !== undefined && args.dateInputs !== undefined) {
					args.dateInputs.forEach(function(dateInput) {
						browser
							.expect.element(selectElem(dateInput)).to.be.visible;
						browser
							.expect.element(selectElem(dateInput + 'Delete')).to.be.visible;
					});
				}
			},
			assertUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('addButton')).to.not.be.visible;
				if (args !== undefined && args.dateInputs !== undefined) {
					args.dateInputs.forEach(function(dateInput) {
						browser
							.expect.element(selectElem(dateInput)).to.not.be.visible;
						browser
							.expect.element(selectElem(dateInput + 'Delete')).to.not.be.visible;
					});
				}
			},
			assertUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('addButton')).to.be.present;
				if (args !== undefined && args.dateInputs !== undefined) {
					args.dateInputs.forEach(function(dateInput) {
						browser
							.expect.element(selectElem(dateInput)).to.be.present;
						browser
							.expect.element(selectElem(dateInput + 'Delete')).to.be.present;
					});
				}
			},
			assertUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('addButton')).to.not.be.present;
				if (args !== undefined && args.dateInputs !== undefined) {
					args.dateInputs.forEach(function(dateInput) {
						browser
							.expect.element(selectElem(dateInput)).to.not.be.present;
						browser
							.expect.element(selectElem(dateInput + 'Delete')).to.not.be.present;
					});
				}
			},
			fillInput: function(browser, input) {
				var dateInputs = Object.keys(input);
				dateInputs.forEach(function(dateInput) {
					browser
						.clearValue(selectElem(dateInput))
						.setValue(selectElem(dateInput), input[dateInput]);
				});
			},
			assertInput: function(browser, input) {
				var dateInputs = Object.keys(input);
				dateInputs.forEach(function(dateInput) {
					browser
						.getValue(selectElem(dateInput), function (result) {
							browser.api.assert.equal(result.state, "success");
							browser.api.assert.equal(result.value, input[dateInput]);
						});
				});
			},
		},
	};

	return self;
};
