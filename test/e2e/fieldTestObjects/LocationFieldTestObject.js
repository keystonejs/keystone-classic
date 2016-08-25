var utils = require('../utils');

module.exports = function LocationFieldTestObject (config) {
	var selectElem = function(elem) {
		return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
	};
	var self = {
		selector: '[data-field-name=' + config.fieldName + '][data-field-type=location]',
		elements: {
			label: '.FormLabel',
			showMore: '.Button--link',
			street1Field: '[data-field-location-path="' + config.fieldName + '.street1"]',
			street1Label: '[data-field-location-path="' + config.fieldName + '.street1"] label',
			street1Value: '[data-field-location-path="' + config.fieldName + '.street1"] input[name="' + config.fieldName + '.street1"]',
			suburbStateField: '[data-field-location-path="' + config.fieldName + '.suburb_state"]',
			suburbLabel: '[data-field-location-path="' + config.fieldName + '.suburb_state"] label',
			suburbValue: '[data-field-location-path="' + config.fieldName + '.suburb_state"] input[name="' + config.fieldName + '.suburb"]',
			stateValue: '[data-field-location-path="' + config.fieldName + '.suburb_state"] input[name="' + config.fieldName + '.state"]',
			postcodeCountryField: '[data-field-location-path="' + config.fieldName + '.postcode_country"]',
			postcodeLabel: '[data-field-location-path="' + config.fieldName + '.postcode_country"] label',
			postcodeValue: '[data-field-location-path="' + config.fieldName + '.postcode_country"] input[name="' + config.fieldName + '.postcode"]',
			countryValue: '[data-field-location-path="' + config.fieldName + '.postcode_country"] input[name="' + config.fieldName + '.country"]',
			numberField: '[data-field-location-path="' + config.fieldName + '.number"]',
			numberLabel: '[data-field-location-path="' + config.fieldName + '.number"] label',
			numberValue: '[data-field-location-path="' + config.fieldName + '.number"] input[name="' + config.fieldName + '.number"]',
			nameField: '[data-field-location-path="' + config.fieldName + '.name"]',
			nameLabel: '[data-field-location-path="' + config.fieldName + '.name"] label',
			nameValue: '[data-field-location-path="' + config.fieldName + '.name"] input[name="' + config.fieldName + '.name"]',
			street2Field: '[data-field-location-path="' + config.fieldName + '.street2"]',
			street2Label: '[data-field-location-path="' + config.fieldName + '.street2"] label',
			street2Value: '[data-field-location-path="' + config.fieldName + '.street2"] input[name="' + config.fieldName + '.street2"]',
			geoField: '[data-field-location-path="' + config.fieldName + '.geo"]',
			geoLabel: '[data-field-location-path="' + config.fieldName + '.geo"] label',
			geoLatValue: '[data-field-location-path="' + config.fieldName + '.geo"] input[name="' + config.fieldName + '.geo[1]"]',
			geoLngValue: '[data-field-location-path="' + config.fieldName + '.geo"] input[name="' + config.fieldName + '.geo[0]"]',
		},
		commands: {
			clickUI: function (browser, elem) {
				browser.click(selectElem(elem));
			},
			assertUIVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.visible;
				browser
					.expect.element(selectElem('label')).text.to.equal(utils.titlecase(config.fieldName));
				if (!args.showMore) {
					browser
						.expect.element(selectElem('showMore')).to.be.visible;
				}
				browser
					.expect.element(selectElem('street1Field')).to.be.visible;
				browser
					.expect.element(selectElem('street1Label')).to.be.visible;
				browser
					.expect.element(selectElem('street1Value')).to.be.visible;
				browser
					.expect.element(selectElem('street1Label')).text.to.equal("Street Address");
				browser
					.expect.element(selectElem('suburbStateField')).to.be.visible;
				browser
					.expect.element(selectElem('suburbLabel')).to.be.visible;
				browser
					.expect.element(selectElem('suburbValue')).to.be.visible;
				browser
					.expect.element(selectElem('stateValue')).to.be.visible;
				browser
					.expect.element(selectElem('suburbLabel')).text.to.equal("Suburb / State");
				browser
					.expect.element(selectElem('postcodeCountryField')).to.be.visible;
				browser
					.expect.element(selectElem('postcodeLabel')).to.be.visible;
				browser
					.expect.element(selectElem('countryValue')).to.be.visible;
				browser
					.expect.element(selectElem('postcodeValue')).to.be.visible;
				browser
					.expect.element(selectElem('postcodeLabel')).text.to.equal("Postcode / Country");
				if (args.showMore) {
					browser
						.expect.element(selectElem('numberField')).to.be.visible;
					browser
						.expect.element(selectElem('numberLabel')).to.be.visible;
					browser
						.expect.element(selectElem('numberValue')).to.be.visible;
					browser
						.expect.element(selectElem('numberLabel')).text.to.equal("PO Box / Shop");
					browser
						.expect.element(selectElem('nameField')).to.be.visible;
					browser
						.expect.element(selectElem('nameLabel')).to.be.visible;
					browser
						.expect.element(selectElem('nameValue')).to.be.visible;
					browser
						.expect.element(selectElem('nameLabel')).text.to.equal("Building Name");
					browser
						.expect.element(selectElem('street2Field')).to.be.visible;
					browser
						.expect.element(selectElem('street2Label')).to.be.visible;
					browser
						.expect.element(selectElem('street2Value')).to.be.visible;
					browser
						.expect.element(selectElem('street2Label')).text.to.equal("Street Address 2");
					browser
						.expect.element(selectElem('geoField')).to.be.visible;
					browser
						.expect.element(selectElem('geoLabel')).to.be.visible;
					browser
						.expect.element(selectElem('geoLatValue')).to.be.visible;
					browser
						.expect.element(selectElem('geoLngValue')).to.be.visible;
					browser
						.expect.element(selectElem('geoLabel')).text.to.equal("Lat / Lng");
				}
			},
			assertUINotVisible: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.visible;
				if (!args.showMore) {
					browser
						.expect.element(selectElem('showMore')).to.not.be.visible;
				}
				browser
					.expect.element(selectElem('street1Field')).to.not.be.visible;
				browser
					.expect.element(selectElem('street1Label')).to.not.be.visible;
				browser
					.expect.element(selectElem('street1Value')).to.not.be.visible;
				browser
					.expect.element(selectElem('suburbStateField')).to.not.be.visible;
				browser
					.expect.element(selectElem('suburbLabel')).to.not.be.visible;
				browser
					.expect.element(selectElem('suburbValue')).to.not.be.visible;
				browser
					.expect.element(selectElem('stateValue')).to.not.be.visible;
				browser
					.expect.element(selectElem('postcodeCountryField')).to.not.be.visible;
				browser
					.expect.element(selectElem('postcodeLabel')).to.not.be.visible;
				browser
					.expect.element(selectElem('countryValue')).to.not.be.visible;
				browser
					.expect.element(selectElem('postcodeValue')).to.not.be.visible;
				if (args.showMore) {
					browser
						.expect.element(selectElem('numberField')).to.not.be.visible;
					browser
						.expect.element(selectElem('numberLabel')).to.not.be.visible;
					browser
						.expect.element(selectElem('numberValue')).to.not.be.visible;
					browser
						.expect.element(selectElem('nameField')).to.not.be.visible;
					browser
						.expect.element(selectElem('nameLabel')).to.not.be.visible;
					browser
						.expect.element(selectElem('nameValue')).to.not.be.visible;
					browser
						.expect.element(selectElem('street2Field')).to.not.be.visible;
					browser
						.expect.element(selectElem('street2Label')).to.not.be.visible;
					browser
						.expect.element(selectElem('street2Value')).to.not.be.visible;
					browser
						.expect.element(selectElem('geoField')).to.not.be.visible;
					browser
						.expect.element(selectElem('geoLabel')).to.not.be.visible;
					browser
						.expect.element(selectElem('geoLatValue')).to.not.be.visible;
					browser
						.expect.element(selectElem('geoLngValue')).to.not.be.visible;
				}
			},
			assertUIPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.be.present;
				if (!args.showMore) {
					browser
						.expect.element(selectElem('showMore')).to.be.present;
				}
				browser
					.expect.element(selectElem('street1Field')).to.be.present;
				browser
					.expect.element(selectElem('street1Label')).to.be.present;
				browser
					.expect.element(selectElem('street1Value')).to.be.present;
				browser
					.expect.element(selectElem('suburbStateField')).to.be.present;
				browser
					.expect.element(selectElem('suburbLabel')).to.be.present;
				browser
					.expect.element(selectElem('suburbValue')).to.be.present;
				browser
					.expect.element(selectElem('stateValue')).to.be.present;
				browser
					.expect.element(selectElem('postcodeCountryField')).to.be.present;
				browser
					.expect.element(selectElem('postcodeLabel')).to.be.present;
				browser
					.expect.element(selectElem('countryValue')).to.be.present;
				browser
					.expect.element(selectElem('postcodeValue')).to.be.present;
				if (args.showMore) {
					browser
						.expect.element(selectElem('numberField')).to.be.present;
					browser
						.expect.element(selectElem('numberLabel')).to.be.present;
					browser
						.expect.element(selectElem('numberValue')).to.be.present;
					browser
						.expect.element(selectElem('nameField')).to.be.present;
					browser
						.expect.element(selectElem('nameLabel')).to.be.present;
					browser
						.expect.element(selectElem('nameValue')).to.be.present;
					browser
						.expect.element(selectElem('street2Field')).to.be.present;
					browser
						.expect.element(selectElem('street2Label')).to.be.present;
					browser
						.expect.element(selectElem('street2Value')).to.be.present;
					browser
						.expect.element(selectElem('geoField')).to.be.present;
					browser
						.expect.element(selectElem('geoLabel')).to.be.present;
					browser
						.expect.element(selectElem('geoLatValue')).to.be.present;
					browser
						.expect.element(selectElem('geoLngValue')).to.be.present;
				}
			},
			assertUINotPresent: function(browser, args) {
				browser
					.expect.element(selectElem('label')).to.not.be.present;
				if (!args.showMore) {
					browser
						.expect.element(selectElem('showMore')).to.not.be.present;
				}
				browser
					.expect.element(selectElem('street1Field')).to.not.be.present;
				browser
					.expect.element(selectElem('street1Label')).to.not.be.present;
				browser
					.expect.element(selectElem('street1Value')).to.not.be.present;
				browser
					.expect.element(selectElem('suburbStateField')).to.not.be.present;
				browser
					.expect.element(selectElem('suburbLabel')).to.not.be.present;
				browser
					.expect.element(selectElem('suburbValue')).to.not.be.present;
				browser
					.expect.element(selectElem('stateValue')).to.not.be.present;
				browser
					.expect.element(selectElem('postcodeCountryField')).to.not.be.present;
				browser
					.expect.element(selectElem('postcodeLabel')).to.not.be.present;
				browser
					.expect.element(selectElem('countryValue')).to.not.be.present;
				browser
					.expect.element(selectElem('postcodeValue')).to.not.be.present;
				if (args.showMore) {
					browser
						.expect.element(selectElem('numberField')).to.not.be.present;
					browser
						.expect.element(selectElem('numberLabel')).to.not.be.present;
					browser
						.expect.element(selectElem('numberValue')).to.not.be.present;
					browser
						.expect.element(selectElem('nameField')).to.not.be.present;
					browser
						.expect.element(selectElem('nameLabel')).to.not.be.present;
					browser
						.expect.element(selectElem('nameValue')).to.not.be.present;
					browser
						.expect.element(selectElem('street2Field')).to.not.be.present;
					browser
						.expect.element(selectElem('street2Label')).to.not.be.present;
					browser
						.expect.element(selectElem('street2Value')).to.not.be.present;
					browser
						.expect.element(selectElem('geoField')).to.not.be.present;
					browser
						.expect.element(selectElem('geoLabel')).to.not.be.present;
					browser
						.expect.element(selectElem('geoLatValue')).to.not.be.present;
					browser
						.expect.element(selectElem('geoLngValue')).to.not.be.present;
				}
			},
			showMoreFields: function(browser, input) {
				browser
					.waitForElementVisible(selectElem('showMore'))
					.click(selectElem('showMore'))
					.waitForElementVisible(selectElem('numberField'));
			},
			fillInput: function(browser, input) {
				browser
					.clearValue(selectElem('numberValue'))
					.setValue(selectElem('numberValue'), input.number);
				browser
					.clearValue(selectElem('nameValue'))
					.setValue(selectElem('nameValue'), input.name);
				browser
					.clearValue(selectElem('street1Value'))
					.setValue(selectElem('street1Value'), input.street1);
				browser
					.clearValue(selectElem('street2Value'))
					.setValue(selectElem('street2Value'), input.street2);
				browser
					.clearValue(selectElem('suburbValue'))
					.setValue(selectElem('suburbValue'), input.suburb);
				browser
					.clearValue(selectElem('stateValue'))
					.setValue(selectElem('stateValue'), input.state);
				browser
					.clearValue(selectElem('postcodeValue'))
					.setValue(selectElem('postcodeValue'), input.postcode);
				browser
					.clearValue(selectElem('countryValue'))
					.setValue(selectElem('countryValue'), input.country);
				browser
					.clearValue(selectElem('geoLatValue'))
					.setValue(selectElem('geoLatValue'), input.geoLat);
				browser
					.clearValue(selectElem('geoLngValue'))
					.setValue(selectElem('geoLngValue'), input.geoLng);
			},
			assertInput: function(browser, input) {
				browser
					.waitForElementVisible(selectElem('numberValue'));
				browser
					.getValue(selectElem('numberValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.number);
					});
				browser
					.waitForElementVisible(selectElem('nameValue'));
				browser
					.getValue(selectElem('nameValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.name);
					});
				browser
					.waitForElementVisible(selectElem('street1Value'));
				browser
					.getValue(selectElem('street1Value'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.street1);
					});
				browser
					.waitForElementVisible(selectElem('street2Value'));
				browser
					.getValue(selectElem('street2Value'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.street2);
					});
				browser
					.waitForElementVisible(selectElem('suburbValue'));
				browser
					.getValue(selectElem('suburbValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.suburb);
					});
				browser
					.waitForElementVisible(selectElem('stateValue'));
				browser
					.getValue(selectElem('stateValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.state);
					});
				browser
					.waitForElementVisible(selectElem('postcodeValue'));
				browser
					.getValue(selectElem('postcodeValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.postcode);
					});
				browser
					.waitForElementVisible(selectElem('countryValue'));
				browser
					.getValue(selectElem('countryValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.country);
					});
				browser
					.waitForElementVisible(selectElem('geoLatValue'));
				browser
					.getValue(selectElem('geoLatValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.geoLat);
					});
				browser
					.waitForElementVisible(selectElem('geoLngValue'));
				browser
					.getValue(selectElem('geoLngValue'), function (result) {
						browser.api.assert.equal(result.state, "success");
						browser.api.assert.equal(result.value, input.geoLng);
					});
			},
		},
	};

	return self;
};
