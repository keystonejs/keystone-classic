var utils = require('../utils');

module.exports = function TextArrayFieldTestObject(config) {
	var selectElem = function (elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
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
		commands: {
			clickUI: function (browser, elem) {
				browser.click(selectElem(elem));
			},
			assertUIVisible: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('addButton')).to.be.visible;
				if (args !== undefined && args.textInputs !== undefined) {
					args.textInputs.forEach(function (textInput) {
						browser
							.expect.element(selectElem(textInput)).to.be.visible;
						browser
							.expect.element(selectElem(textInput + 'Delete')).to.be.visible;
					});
				}
			},
			assertUINotVisible: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('addButton')).to.not.be.visible;
				if (args !== undefined && args.textInputs !== undefined) {
					args.textInputs.forEach(function (textInput) {
						browser
							.expect.element(selectElem(textInput)).to.not.be.visible;
						browser
							.expect.element(selectElem(textInput + 'Delete')).to.not.be.visible;
					});
				}
			},
			assertUIPresent: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('addButton')).to.be.present;
				if (args !== undefined && args.textInputs !== undefined) {
					args.textInputs.forEach(function (textInput) {
						browser
							.expect.element(selectElem(textInput)).to.be.present;
						browser
							.expect.element(selectElem(textInput + 'Delete')).to.be.present;
					});
				}
			},
			assertUINotPresent: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('addButton')).to.not.be.present;
				if (args !== undefined && args.textInputs !== undefined) {
					args.textInputs.forEach(function (textInput) {
						browser
							.expect.element(selectElem(textInput)).to.not.be.present;
						browser
							.expect.element(selectElem(textInput + 'Delete')).to.not.be.present;
					});
				}
			},
			fillInput: function (browser, input) {
				textInputs = Object.keys(input);
				textInputs.forEach(function (textInput) {
					browser
						.clearValue(selectElem(textInput))
						.setValue(selectElem(textInput), input[textInput]);
				});
			},
			assertInput: function (browser, input) {
				textInputs = Object.keys(input);
				textInputs.forEach(function (textInput) {
					browser
						.getValue(selectElem(textInput), function (result) {
							browser.api.assert.equal(result.state, "success");
							browser.api.assert.equal(result.value, input[textInput]);
						});
				});
			},
		},
	};

	return self;
};
