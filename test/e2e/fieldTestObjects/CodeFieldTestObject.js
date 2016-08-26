var utils = require('../utils');

module.exports = function CodeFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '.field-type-code[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			lineNumber: '.CodeMirror-linenumber',
			codeMirror: '.CodeMirror-container',
		},
		commands: {
			assertFieldUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('lineNumber')).to.be.visible;
				browser
					.expect.element(selectElem('lineNumber')).text.to.equal('1');
				browser
					.expect.element(selectElem('codeMirror')).to.be.visible;
			},
			assertFieldUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('lineNumber')).to.not.be.visible;
				browser
					.expect.element(selectElem('lineNumber')).text.to.equal('1');
				browser
					.expect.element(selectElem('codeMirror')).to.not.be.visible;
			},
			assertFieldUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('lineNumber')).to.be.present;
				browser
					.expect.element(selectElem('lineNumber')).text.to.equal('1');
				browser
					.expect.element(selectElem('codeMirror')).to.be.present;
			},
			assertFieldUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('lineNumber')).to.not.be.present;
				browser
					.expect.element(selectElem('lineNumber')).text.to.equal('1');
				browser
					.expect.element(selectElem('codeMirror')).to.not.be.present;
			},
			fillFieldInputs: function(browser, input) {
				browser.api
					.execute(function (selector, input) {
						var x = document.querySelector(selector);
						var y = x.getElementsByClassName('CodeMirror')[0];
						y.CodeMirror.setValue(input.value);
					}, [self.selector, input]);
			},
			assertFieldInputs: function(browser, input) {
				browser.api
					.execute(function (selector) {
						 var x = document.querySelector(selector);
						 var y = x.getElementsByClassName('CodeMirror')[0];
						 return y.CodeMirror.getValue();
					}, [self.selector], function (result) {
						browser.assert.equal(result.value, input.value);
					});
			},
		},
	};

	return self;
};
