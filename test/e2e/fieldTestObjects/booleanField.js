var utils = require('../utils');

module.exports = function FieldTestObject (config) {
	var selectElem = function(elem) {
		return self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '[data-field-name=' + config.fieldName + '][data-field-type=boolean]',
		elements: {
			button: 'button',
			label: 'span',
			value: 'label input[name="' + config.fieldName + '"]',
		},
		selectElem: function(elem) {
			return self.selector + ' ' + self.elements[elem];
		},
		commands: {
			assertUIVisible: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('button')).to.be.visible;
			},
			assertUINotVisible: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.not.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('button')).to.not.be.visible;
			},
			assertUIPresent: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('button')).to.be.present;
			},
			assertUINotPresent: function (browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('button')).to.not.be.present;
			},
			fillInput: function (browser, input) {
				browser
					.getValue(selectElem('value'), function (result) {
						if (input.value !== result.value)
							browser.click(selectElem('button'));
					});
			},
			assertInput: function (browser, input) {
				browser
					.getValue(selectElem('value'), function (result) {
						browser.api.assert.equal(result.value, input.value);
					});
			},
		},
	};
	return self;
};
