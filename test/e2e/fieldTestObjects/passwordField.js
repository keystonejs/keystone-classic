var utils = require('../utils');

module.exports = function PasswordType(config) {
	var selectElem = function(elem) {
		return self.selector + ' ' + self.elements[elem];
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
			clickUI: function(browser, ui) {
				var clickables = Object.keys(ui);
				clickables.forEach(function(clickable) {
					browser.click(selectElem(ui[clickable]));
				});
			},
			assertUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				if (args.editForm){
					// In the edit form, a "Set Password" button is shown, unless showPassword has been clicked
					if (args.passwordShown) {
						browser
							.expect.element(selectElem('value')).to.be.visible;
					} else {
						browser
							.expect.element(selectElem('setPasswordButton')).to.be.visible;
					}

				} else {
					// In the initial form, the input field is shown immediately.
					browser
						.expect.element(selectElem('value')).to.be.visible;
				}
			},
			assertUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				if (args.editForm){
					// In the edit form, a "Set Password" button is shown, unless showPassword has been clicked
					if (args.passwordShown) {
						browser
							.expect.element(selectElem('value')).to.not.be.visible;
					} else {
						browser
							.expect.element(selectElem('setPasswordButton')).to.not.be.visible;
					}
				} else {
					// In the initial form, the input field is shown immediately.
					browser
						.expect.element(selectElem('value')).to.not.be.visible;
				}
			},
			assertUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				if (args.editForm){
					// In the edit form, a "Set Password" button is shown, unless showPassword has been clicked
					if (args.passwordShown) {
						browser
							.expect.element(selectElem('value')).to.be.present;
					} else {
						browser
							.expect.element(selectElem('setPasswordButton')).to.be.present;
					}

				} else {
					// In the initial form, the input field is shown immediately.
					browser
						.expect.element(selectElem('value')).to.be.present;
				}
			},
			assertUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				if (args.editForm){
					// In the edit form, a "Set Password" button is shown, unless showPassword has been clicked
					if (args.passwordShown) {
						browser
							.expect.element(selectElem('value')).to.not.be.present;
					} else {
						browser
							.expect.element(selectElem('setPasswordButton')).to.not.be.present;
					}
				} else {
					// In the initial form, the input field is shown immediately.
					browser
						.expect.element(selectElem('value')).to.not.be.present;
				}
			},
			fillInput: function(browser, input) {
				browser
					.clearValue(selectElem('value'))
					.setValue(selectElem('value'), input.value)
					.clearValue(selectElem('confirmValue'))
					.setValue(selectElem('confirmValue'), input.confirm)
			},
			assertInput: function(browser, input) {
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
