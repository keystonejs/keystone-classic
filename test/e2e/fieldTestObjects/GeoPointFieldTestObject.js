var utils = require('../utils');

module.exports = function GeoPointFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '.field-type-geopoint[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			valueLat: 'input[name="' + config.fieldName + '[1]"][placeholder="Latitude"]',
			valueLng: 'input[name="' + config.fieldName + '[0]"][placeholder="Longitude"]',
		},
		commands: {
			assertFieldUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('valueLat')).to.be.visible;
				browser
					.expect.element(selectElem('valueLng')).to.be.visible;
			},
			assertFieldUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				browser
					.expect.element(selectElem('valueLat')).to.not.be.visible;
				browser
					.expect.element(selectElem('valueLng')).to.not.be.visible;
			},
			assertFieldUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				browser
					.expect.element(selectElem('valueLat')).to.be.present;
				browser
					.expect.element(selectElem('valueLng')).to.be.present;
			},
			assertFieldUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				browser
					.expect.element(selectElem('valueLat')).to.not.be.present;
				browser
					.expect.element(selectElem('valueLng')).to.not.be.present;
			},
			fillFieldInputs: function(browser, input) {
				browser
					.clearValue(selectElem('valueLat'))
					.setValue(selectElem('valueLat'), input.lat);
				browser
					.clearValue(selectElem('valueLng'))
					.setValue(selectElem('valueLng'), input.lng);
			},
			assertFieldInputs: function(browser, input) {
				browser
					.waitForElementVisible(selectElem('valueLat'));
				browser
					.getValue(selectElem('valueLat'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.lat);
					}.bind(browser));
				browser
					.waitForElementVisible(selectElem('valueLng'));
				browser
					.getValue(selectElem('valueLng'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.lng);
					}.bind(browser));
			},
		},
	};

	return self;
};
