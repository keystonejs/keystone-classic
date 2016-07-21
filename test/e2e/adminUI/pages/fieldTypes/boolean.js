var utils = require('../../../utils');

// NOTE removed unused class ".field-type-boolean" from the Field Type
// TODO resolve test issues

module.exports = function BooleanType(config) {
	var self = {
		selector: '.field-type-boolean[for="' + config.fieldName + '"]',
		elements: {
			button: 'button',
			label: 'span',
			value: 'label input[name="' + config.fieldName + '"]',
		},
		commands: [{
			assertUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@button').to.be.visible;
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

	return self;
}
