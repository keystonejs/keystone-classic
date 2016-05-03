var utils = require('../../../utils');

module.exports = function SelectType(config) {
	var self = {
		selector: '.field-type-select[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			selectField: '.Select',
			selectValue: '.Select-value-label',
			placeholder: '.Select-placeholder',
			dropdownArrow: '.Select-arrow-zone',
			optionOne: '.Select-menu-outer option[value="One"]',
		},
		commands: [{
			verifyUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@selectField').to.be.visible;
				this
					.expect.element('@placeholder').to.be.visible;
				this
					.expect.element('@dropdownArrow').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this
					.click('@selectField')
					.api.keys([input.value, this.api.Keys.ENTER]);
				return this;
			},
			assertInput: function(input) {
				this
					.expect.element('@selectValue')
					.text.to.equals(input.value);
				return this;
			},
		}],
	};

	return self;
};
