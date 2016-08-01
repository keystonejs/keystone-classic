var utils = require('../../../utils');

// NOTE removed unused class ".field-type-boolean" from the Field Type
// TODO resolve test issues

module.exports = function BooleanType(config) {
	return {
		selector: '[data-field-name=' + config.fieldName + '][data-field-type=boolean]',
		elements: {
			button: 'button',
			label: 'span',
			value: 'label input[name="' + config.fieldName + '"]',
		},
		commands: [{
			assertUIVisible: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@button').to.be.visible;
			},
			assertUINotVisible: function(args) {
				this
					.expect.element('@label').to.not.be.visible;
				this
					.expect.element('@label').text.to.not.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@button').to.not.be.visible;
			},
			assertUIPresent: function(args) {
				this
					.expect.element('@label').to.be.present;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@button').to.be.present;
			},
			assertUINotPresent: function(args) {
				this
					.expect.element('@label').to.not.be.present;
				this
					.expect.element('@button').to.not.be.present;
			},
			assertUI: function(args) {
				this.assertUIVisible(args)
			},
			fillInput: function(input) {
				var self = this;
				this
					.getValue('@value', function(result) {
						if (input.value !== result.value)
							self.click('@button');
					});
			},
			assertInput: function(input) {
				this
					.getValue('@value', function(result) {
						this.api.assert.equal(result.value, input.value);
					});
				return this;
			},
		}],
	};
};
