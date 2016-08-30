var utils = require('../utils');

module.exports = function PasswordFieldTestObject(config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '.field-type-password[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'input[name="' + config.fieldName + '"]',
			confirmValue: 'input[name="' + config.fieldName + '_confirm"]',
			setPasswordButton: '.Button',
		},
		commands: {
			clickFieldUI: function (browser, elem) {
				browser.click(selectElem(elem));
			},
			assertFieldUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				if (args.passwordShown) {
					browser
						.expect.element(selectElem('value')).to.be.visible;
				} else {
					browser
						.expect.element(selectElem('setPasswordButton')).to.be.visible;
				}
			},
			assertFieldUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				if (args.passwordShown) {
					browser
						.expect.element(selectElem('value')).to.not.be.visible;
				} else {
					browser
						.expect.element(selectElem('setPasswordButton')).to.not.be.visible;
				}
			},
			assertFieldUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				if (args.passwordShown) {
					browser
						.expect.element(selectElem('value')).to.be.present;
				} else {
					browser
						.expect.element(selectElem('setPasswordButton')).to.be.present;
				}
			},
			assertFieldUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				if (args.passwordShown) {
					browser
						.expect.element(selectElem('value')).to.not.be.present;
				} else {
					browser
						.expect.element(selectElem('setPasswordButton')).to.not.be.present;
				}
			},
			fillFieldInputs: function(browser, input) {
				browser
					.clearValue(selectElem('value'))
					.setValue(selectElem('value'), input.value)
					.clearValue(selectElem('confirmValue'))
					.setValue(selectElem('confirmValue'), input.confirm)
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
