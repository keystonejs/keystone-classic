var utils = require('../utils');

module.exports = function RelationshipFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '.field-type-relationship[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			placeholder: '.Select-placeholder',
			value: 'input',
			filledValue: '.Select-value-label',
			arrow: '.Select-arrow-zone',
			clear: '.Select-clear-zone',
			option1: '.Select-option:nth-of-type(1)',
			option2: '.Select-option:nth-of-type(2)'
		},
		commands: {
			assertFieldUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('placeholder')).to.be.visible;
			},
			assertFieldUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('placeholder')).to.not.be.visible;
			},
			assertFieldUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('placeholder')).to.be.present;
			},
			assertFieldUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('placeholder')).to.not.be.present;
			},
			fillFieldInputs: function(browser, input) {
				if (input.option) {
					browser
						.click(selectElem('arrow'))
						.waitForElementVisible(selectElem('option1'))
						.click(selectElem(input.option));
				} else if (input.value) {
					browser
						.clearValue(selectElem('value'))
						.api.keys([input.value, browser.api.Keys.ENTER]);
				}
			},
			assertFieldInputs: function(browser, input) {
				browser
					.waitForElementVisible(selectElem('filledValue'));
				browser
					.getText(selectElem('filledValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.value);
					});
			},
		},
	};

	return self;
};
