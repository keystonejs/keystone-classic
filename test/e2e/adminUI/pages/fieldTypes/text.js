var utils = require('../../../utils');

module.exports = function TextType(config) {
	return {
		selector: '.field-type-text[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'input[name="' + config.fieldName + '"]',
		},
		commands: [{
			assertUIVisible: function () {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@value').to.be.visible;
				return this;
			},
			assertUINotVisible: function () {
				this
					.expect.element('@label').to.not.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@value').to.not.be.visible;
				return this;
			},
			assertUIPresent: function () {
				this
					.expect.element('@label').to.be.present;
				this
					.expect.element('@value').to.be.present;
				return this;
			},
			assertUINotPresent: function () {
				this
					.expect.element('@label').to.not.be.present;
				this
					.expect.element('@value').to.not.be.present;
				return this;
			},
			assertUI: function () {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@value').to.be.visible;
				return this;
			},
			fillInput: function (input) {
				this
					.clearValue('@value')
					.setValue('@value', input.value);
				return this;
			},
			assertInput: function (input) {
				var self = this;
				this
					.waitForElementVisible('@value');
				this
					.getValue('@value', function (result) {
						self.api.assert.equal(result.state, "success");
						self.api.assert.equal(result.value, input.value);
					});
				return this;
			},
		}],
	};
};
