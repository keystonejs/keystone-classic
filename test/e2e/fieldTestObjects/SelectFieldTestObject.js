var utils = require('../utils');

module.exports = function SelectFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
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
		commands: {
			assertFieldUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('selectField')).to.be.visible;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					browser
						.expect.element(selectElem('placeholder')).to.be.visible;
				}
				browser
					.expect.element(selectElem('dropdownArrow')).to.be.visible;
			},
			assertFieldUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.not.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('selectField')).to.not.be.visible;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					browser
						.expect.element(selectElem('placeholder')).to.not.be.visible;
				}
				browser
					.expect.element(selectElem('dropdownArrow')).to.not.be.visible;
			},
			assertFieldUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('selectField')).to.be.present;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					browser
						.expect.element(selectElem('placeholder')).to.be.present;
				}
				browser
					.expect.element(selectElem('dropdownArrow')).to.be.present;
			},
			assertFieldUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('selectField')).to.not.be.present;
				if (!args.editForm) {
					// Placeholder won't be there in the edit form as the select will be filled.
					browser
						.expect.element(selectElem('placeholder')).to.not.be.present;
				}
				browser
					.expect.element(selectElem('dropdownArrow')).to.not.be.present;
			},
			fillFieldInputs: function(browser, input) {
				browser
					.click(selectElem('selectField'))
					.api.keys([input.value, browser.api.Keys.ENTER]);
			},
			assertFieldInputs: function(browser, input) {
				browser
					.expect.element(selectElem('selectValue'))
					.text.to.equals(input.value);
			},
		},
	};

	return self;
};
