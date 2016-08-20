var utils = require('../utils');

module.exports = function FieldTestObject (config) {
	var selectElem = function(elem) {
		return self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '.field-type-text[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'input[name="' + config.fieldName + '"]',
		},
		commands: {
			assertUIVisible: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('value')).to.be.visible;
			},
			assertUINotVisible: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('value')).to.not.be.visible;
			},
			assertUIPresent: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('value')).to.be.present;
			},
			assertUINotPresent: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('value')).to.not.be.present;
			},
			fillInput: function (browser, input) {
				browser
					.clearValue(selectElem('value'))
					.setValue(selectElem('value'), input.value);
			},
			assertInput: function (browser, input) {
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
