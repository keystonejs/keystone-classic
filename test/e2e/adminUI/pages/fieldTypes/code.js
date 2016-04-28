var utils = require('../../../utils');

module.exports = function CodeType(config) {
	var self = {
		selector: '.field-type-code[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			lineNumber: '.CodeMirror-linenumber',
			codeMirror: '.CodeMirror-container',
		},
		commands: [{
			verifyUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@lineNumber').to.be.visible;
				this
					.expect.element('@lineNumber').text.to.equal('1');
				this
					.expect.element('@codeMirror').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this.api
					.execute(function (selector, input) {
						var x = document.querySelector(selector);
						var y = x.getElementsByClassName('CodeMirror')[0];
						y.CodeMirror.setValue(input.value);
					}, [self.elements.codeMirror, input]);
				return this;
			},
			verifyInput: function(input) {
				this.api
					.execute(function (selector) {
						 var x = document.querySelector(selector);
						 var y = x.getElementsByClassName('CodeMirror')[0];
						 return y.CodeMirror.getValue();
					}, [self.elements.codeMirror], function (result) {
						this.assert.equal(result.value, input.value);
					});
				return this;
			},
		}],
	};

	return self;
};
