var utils = require('../../../utils');

module.exports = function LocationType(config) {
	return {
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
		commands: [{
			assertUIVisible: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				if (!args.showMore) {
					this
						.expect.element('@showMore').to.be.visible;
				}
				this
					.expect.element('@street1Field').to.be.visible;
				this
					.expect.element('@street1Label').to.be.visible;
				this
					.expect.element('@street1Value').to.be.visible;
				this
					.expect.element('@street1Label').text.to.equal("Street Address");
				this
					.expect.element('@suburbStateField').to.be.visible;
				this
					.expect.element('@suburbLabel').to.be.visible;
				this
					.expect.element('@suburbValue').to.be.visible;
				this
					.expect.element('@stateValue').to.be.visible;
				this
					.expect.element('@suburbLabel').text.to.equal("Suburb / State");
				this
					.expect.element('@postcodeCountryField').to.be.visible;
				this
					.expect.element('@postcodeLabel').to.be.visible;
				this
					.expect.element('@countryValue').to.be.visible;
				this
					.expect.element('@postcodeValue').to.be.visible;
				this
					.expect.element('@postcodeLabel').text.to.equal("Postcode / Country");
				if (args.showMore) {
					this
						.expect.element('@numberField').to.be.visible;
					this
						.expect.element('@numberLabel').to.be.visible;
					this
						.expect.element('@numberValue').to.be.visible;
					this
						.expect.element('@numberLabel').text.to.equal("PO Box / Shop");
					this
						.expect.element('@nameField').to.be.visible;
					this
						.expect.element('@nameLabel').to.be.visible;
					this
						.expect.element('@nameValue').to.be.visible;
					this
						.expect.element('@nameLabel').text.to.equal("Building Name");
					this
						.expect.element('@street2Field').to.be.visible;
					this
						.expect.element('@street2Label').to.be.visible;
					this
						.expect.element('@street2Value').to.be.visible;
					this
						.expect.element('@street2Label').text.to.equal("Street Address 2");
					this
						.expect.element('@geoField').to.be.visible;
					this
						.expect.element('@geoLabel').to.be.visible;
					this
						.expect.element('@geoLatValue').to.be.visible;
					this
						.expect.element('@geoLngValue').to.be.visible;
					this
						.expect.element('@geoLabel').text.to.equal("Lat / Lng");
				}
				return this;
			},
			assertUINotVisible: function(args) {
				this
					.expect.element('@label').to.not.be.visible;
				if (!args.showMore) {
					this
						.expect.element('@showMore').to.not.be.visible;
				}
				this
					.expect.element('@street1Field').to.not.be.visible;
				this
					.expect.element('@street1Label').to.not.be.visible;
				this
					.expect.element('@street1Value').to.not.be.visible;
				this
					.expect.element('@suburbStateField').to.not.be.visible;
				this
					.expect.element('@suburbLabel').to.not.be.visible;
				this
					.expect.element('@suburbValue').to.not.be.visible;
				this
					.expect.element('@stateValue').to.not.be.visible;
				this
					.expect.element('@postcodeCountryField').to.not.be.visible;
				this
					.expect.element('@postcodeLabel').to.not.be.visible;
				this
					.expect.element('@countryValue').to.not.be.visible;
				this
					.expect.element('@postcodeValue').to.not.be.visible;
				if (args.showMore) {
					this
						.expect.element('@numberField').to.not.be.visible;
					this
						.expect.element('@numberLabel').to.not.be.visible;
					this
						.expect.element('@numberValue').to.not.be.visible;
					this
						.expect.element('@nameField').to.not.be.visible;
					this
						.expect.element('@nameLabel').to.not.be.visible;
					this
						.expect.element('@nameValue').to.not.be.visible;
					this
						.expect.element('@street2Field').to.not.be.visible;
					this
						.expect.element('@street2Label').to.not.be.visible;
					this
						.expect.element('@street2Value').to.not.be.visible;
					this
						.expect.element('@geoField').to.not.be.visible;
					this
						.expect.element('@geoLabel').to.not.be.visible;
					this
						.expect.element('@geoLatValue').to.not.be.visible;
					this
						.expect.element('@geoLngValue').to.not.be.visible;
				}
				return this;
			},
			assertUIPresent: function(args) {
				this
					.expect.element('@label').to.be.present;
				if (!args.showMore) {
					this
						.expect.element('@showMore').to.be.present;
				}
				this
					.expect.element('@street1Field').to.be.present;
				this
					.expect.element('@street1Label').to.be.present;
				this
					.expect.element('@street1Value').to.be.present;
				this
					.expect.element('@suburbStateField').to.be.present;
				this
					.expect.element('@suburbLabel').to.be.present;
				this
					.expect.element('@suburbValue').to.be.present;
				this
					.expect.element('@stateValue').to.be.present;
				this
					.expect.element('@postcodeCountryField').to.be.present;
				this
					.expect.element('@postcodeLabel').to.be.present;
				this
					.expect.element('@countryValue').to.be.present;
				this
					.expect.element('@postcodeValue').to.be.present;
				if (args.showMore) {
					this
						.expect.element('@numberField').to.be.present;
					this
						.expect.element('@numberLabel').to.be.present;
					this
						.expect.element('@numberValue').to.be.present;
					this
						.expect.element('@nameField').to.be.present;
					this
						.expect.element('@nameLabel').to.be.present;
					this
						.expect.element('@nameValue').to.be.present;
					this
						.expect.element('@street2Field').to.be.present;
					this
						.expect.element('@street2Label').to.be.present;
					this
						.expect.element('@street2Value').to.be.present;
					this
						.expect.element('@geoField').to.be.present;
					this
						.expect.element('@geoLabel').to.be.present;
					this
						.expect.element('@geoLatValue').to.be.present;
					this
						.expect.element('@geoLngValue').to.be.present;
				}
				return this;
			},
			assertUINotPresent: function(args) {
				this
					.expect.element('@label').to.not.be.present;
				if (!args.showMore) {
					this
						.expect.element('@showMore').to.not.be.present;
				}
				this
					.expect.element('@street1Field').to.not.be.present;
				this
					.expect.element('@street1Label').to.not.be.present;
				this
					.expect.element('@street1Value').to.not.be.present;
				this
					.expect.element('@suburbStateField').to.not.be.present;
				this
					.expect.element('@suburbLabel').to.not.be.present;
				this
					.expect.element('@suburbValue').to.not.be.present;
				this
					.expect.element('@stateValue').to.not.be.present;
				this
					.expect.element('@postcodeCountryField').to.not.be.present;
				this
					.expect.element('@postcodeLabel').to.not.be.present;
				this
					.expect.element('@countryValue').to.not.be.present;
				this
					.expect.element('@postcodeValue').to.not.be.present;
				if (args.showMore) {
					this
						.expect.element('@numberField').to.not.be.present;
					this
						.expect.element('@numberLabel').to.not.be.present;
					this
						.expect.element('@numberValue').to.not.be.present;
					this
						.expect.element('@nameField').to.not.be.present;
					this
						.expect.element('@nameLabel').to.not.be.present;
					this
						.expect.element('@nameValue').to.not.be.present;
					this
						.expect.element('@street2Field').to.not.be.present;
					this
						.expect.element('@street2Label').to.not.be.present;
					this
						.expect.element('@street2Value').to.not.be.present;
					this
						.expect.element('@geoField').to.not.be.present;
					this
						.expect.element('@geoLabel').to.not.be.present;
					this
						.expect.element('@geoLatValue').to.not.be.present;
					this
						.expect.element('@geoLngValue').to.not.be.present;
				}
				return this;
			},
			assertUI: function(args) {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				if (!args.showMore) {
					this
						.expect.element('@showMore').to.be.visible;
				}
				this
					.expect.element('@street1Field').to.be.visible;
				this
					.expect.element('@street1Label').to.be.visible;
				this
					.expect.element('@street1Value').to.be.visible;
				this
					.expect.element('@street1Label').text.to.equal("Street Address");
				this
					.expect.element('@suburbStateField').to.be.visible;
				this
					.expect.element('@suburbLabel').to.be.visible;
				this
					.expect.element('@suburbValue').to.be.visible;
				this
					.expect.element('@stateValue').to.be.visible;
				this
					.expect.element('@suburbLabel').text.to.equal("Suburb / State");
				this
					.expect.element('@postcodeCountryField').to.be.visible;
				this
					.expect.element('@postcodeLabel').to.be.visible;
				this
					.expect.element('@countryValue').to.be.visible;
				this
					.expect.element('@postcodeValue').to.be.visible;
				this
					.expect.element('@postcodeLabel').text.to.equal("Postcode / Country");
				if (args.showMore) {
					this
						.expect.element('@numberField').to.be.visible;
					this
						.expect.element('@numberLabel').to.be.visible;
					this
						.expect.element('@numberValue').to.be.visible;
					this
						.expect.element('@numberLabel').text.to.equal("PO Box / Shop");
					this
						.expect.element('@nameField').to.be.visible;
					this
						.expect.element('@nameLabel').to.be.visible;
					this
						.expect.element('@nameValue').to.be.visible;
					this
						.expect.element('@nameLabel').text.to.equal("Building Name");
					this
						.expect.element('@street2Field').to.be.visible;
					this
						.expect.element('@street2Label').to.be.visible;
					this
						.expect.element('@street2Value').to.be.visible;
					this
						.expect.element('@street2Label').text.to.equal("Street Address 2");
					this
						.expect.element('@geoField').to.be.visible;
					this
						.expect.element('@geoLabel').to.be.visible;
					this
						.expect.element('@geoLatValue').to.be.visible;
					this
						.expect.element('@geoLngValue').to.be.visible;
					this
						.expect.element('@geoLabel').text.to.equal("Lat / Lng");
				}
				return this;
			},
			showMoreFields: function(input) {
				this
					.waitForElementVisible('@showMore')
					.click('@showMore')
					.waitForElementVisible('@numberField');
				return this;
			},
			fillInput: function(input) {
				this
					.clearValue('@numberValue')
					.setValue('@numberValue', input.number);
				this
					.clearValue('@nameValue')
					.setValue('@nameValue', input.name);
				this
					.clearValue('@street1Value')
					.setValue('@street1Value', input.street1);
				this
					.clearValue('@street2Value')
					.setValue('@street2Value', input.street2);
				this
					.clearValue('@suburbValue')
					.setValue('@suburbValue', input.suburb);
				this
					.clearValue('@stateValue')
					.setValue('@stateValue', input.state);
				this
					.clearValue('@postcodeValue')
					.setValue('@postcodeValue', input.postcode);
				this
					.clearValue('@countryValue')
					.setValue('@countryValue', input.country);
				this
					.clearValue('@geoLatValue')
					.setValue('@geoLatValue', input.geoLat);
				this
					.clearValue('@geoLngValue')
					.setValue('@geoLngValue', input.geoLng);
				return this;
			},
			assertInput: function(input) {
				this
					.waitForElementVisible('@numberValue');
				this
					.getValue('@numberValue', function (result) {
						this.api.assert.equal(result.state, "success");
						this.api.assert.equal(result.value, input.number);
					}.bind(this));
					this
						.waitForElementVisible('@nameValue');
					this
						.getValue('@nameValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.name);
					}.bind(this));
					this
						.waitForElementVisible('@street1Value');
					this
						.getValue('@street1Value', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.street1);
					}.bind(this));
					this
						.waitForElementVisible('@street2Value');
					this
						.getValue('@street2Value', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.street2);
					}.bind(this));
					this
						.waitForElementVisible('@suburbValue');
					this
						.getValue('@suburbValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.suburb);
					}.bind(this));
					this
						.waitForElementVisible('@stateValue');
					this
						.getValue('@stateValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.state);
					}.bind(this));
					this
						.waitForElementVisible('@postcodeValue');
					this
						.getValue('@postcodeValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.postcode);
					}.bind(this));
					this
						.waitForElementVisible('@countryValue');
					this
						.getValue('@countryValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.country);
					}.bind(this));
					this
						.waitForElementVisible('@geoLatValue');
					this
						.getValue('@geoLatValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.geoLat);
					}.bind(this));
					this
						.waitForElementVisible('@geoLngValue');
					this
						.getValue('@geoLngValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.geoLng);
					}.bind(this));
				return this;
			},
		}],
	};
};
