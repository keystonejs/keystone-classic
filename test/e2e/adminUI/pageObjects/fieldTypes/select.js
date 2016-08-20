var utils = require('../../../utils');

module.exports = function SelectType(config) {
	return {
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
			assertUIVisible: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@selectField').to.be.visible;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					this
						.expect.element('@placeholder').to.be.visible;
				}
				this
					.expect.element('@dropdownArrow').to.be.visible;

				return this;
			},
			assertUINotVisible: function(args) {
				this
					.expect.element('@label').to.not.be.visible;
				this
					.expect.element('@label').text.to.not.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@selectField').to.not.be.visible;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					this
						.expect.element('@placeholder').to.not.be.visible;
				}
				this
					.expect.element('@dropdownArrow').to.not.be.visible;

				return this;
			},
			assertUIPresent: function(args) {
				this
					.expect.element('@label').to.be.present;
				this
					.expect.element('@selectField').to.be.present;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					this
						.expect.element('@placeholder').to.be.present;
				}
				this
					.expect.element('@dropdownArrow').to.be.present;
			},
			assertUINotPresent: function(args) {
				this
					.expect.element('@label').to.not.be.present;
				this
					.expect.element('@selectField').to.not.be.present;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					this
						.expect.element('@placeholder').to.not.be.present;
				}
				this
					.expect.element('@dropdownArrow').to.not.be.present;
			},
			assertUI: function(args) {
				return this.assertUIVisible(args);
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
};
