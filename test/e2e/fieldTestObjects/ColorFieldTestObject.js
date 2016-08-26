var utils = require('../utils');

module.exports = function ColorFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '.field-type-color[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'input[name="' + config.fieldName + '"]',
			button: '.e2e-type-color__button',
			swatch: '.e2e-type-color__swatch',
		},
		commands: {
			assertFieldUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('value')).to.be.visible;
				browser
					.expect.element(selectElem('button')).to.be.visible;
			},
			assertFieldUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('value')).to.not.be.visible;
				browser
					.expect.element(selectElem('button')).to.not.be.visible;
			},
			assertFieldUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('value')).to.be.present;
				browser
					.expect.element(selectElem('button')).to.be.present;
			},
			assertFieldUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('value')).to.not.be.present;
				browser
					.expect.element(selectElem('button')).to.not.be.present;
			},
			fillFieldInputs: function(browser, input) {
				browser
					.clearValue(selectElem('value'))
					.setValue(selectElem('value'), input.value);
			},
			assertFieldInputs: function(browser, input) {
				browser
					.waitForElementVisible(selectElem('value'));
				browser
					.getValue(selectElem('value'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.value);
					});
			},
		},
	};

	return self;
};
