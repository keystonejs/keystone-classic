var utils = require('../../../utils');

module.exports = function LocationType(config) {
	var self = {
		selector: '.field-type-location[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			showMore: '.Button--link',
			street1Field: '.form-field--secondary[for="' + config.fieldName + '.street1"]',
			street1Label: '.FormLabel[for="' + config.fieldName + '.street1"]',
			street1Value: 'input[name="' + config.fieldName + '.street1"]',
			suburbField: '.form-field--secondary[for="' + config.fieldName + '.suburb"]',
			suburbLabel: '.FormLabel[for="' + config.fieldName + '.suburb"]',
			suburbValue: 'input[name="' + config.fieldName + '.suburb"]',
			stateValue: 'input[name="' + config.fieldName + '.state"]',
			postcodeField: '.form-field--secondary[for="' + config.fieldName + '.postcode"]',
			postcodeLabel: '.FormLabel[for="' + config.fieldName + '.postcode"]',
			postcodeValue: 'input[name="' + config.fieldName + '.postcode"]',
			countryValue: 'input[name="' + config.fieldName + '.country"]',
			numberField: '.form-field--secondary[for="' + config.fieldName + '.number"]',
			numberLabel: '.FormLabel[for="' + config.fieldName + '.number"]',
			numberValue: 'input[name="' + config.fieldName + '.number"]',
			nameField: '.form-field--secondary[for="' + config.fieldName + '.name"]',
			nameLabel: '.FormLabel[for="' + config.fieldName + '.name"]',
			nameValue: 'input[name="' + config.fieldName + '.name"]',
			street2Field: '.form-field--secondary[for="' + config.fieldName + '.street2"]',
			street2Label: '.FormLabel[for="' + config.fieldName + '.street2"]',
			street2Value: 'input[name="' + config.fieldName + '.street2"]',
			geoField: '.form-field--secondary[for="' + config.fieldName + '.geo"]',
			geoLabel: '.FormLabel[for="' + config.fieldName + '.geo"]',
			geoLatValue: 'input[name="' + config.fieldName + '.geo"][placeholder="Latitude"]',
			geoLngValue: 'input[name="' + config.fieldName + '.geo"][placeholder="Longitude"]',
		},
		commands: [{
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
					.expect.element('@suburbField').to.be.visible;
				this
					.expect.element('@suburbLabel').to.be.visible;
				this
					.expect.element('@suburbValue').to.be.visible;
				this
					.expect.element('@stateValue').to.be.visible;
				this
					.expect.element('@suburbLabel').text.to.equal("Suburb / State");
				this
					.expect.element('@postcodeField').to.be.visible;
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
			showMore: function() {
				return this
					.click('@showMore')
					.waitForElementVisible('@numberField');
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
					});
					this
						.waitForElementVisible('@nameValue');
					this
						.getValue('@nameValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.name);
					});
					this
						.waitForElementVisible('@street1Value');
					this
						.getValue('@street1Value', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.street1);
					});
					this
						.waitForElementVisible('@street2Value');
					this
						.getValue('@street2Value', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.street2);
					});
					this
						.waitForElementVisible('@suburbValue');
					this
						.getValue('@suburbValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.suburb);
						});
					this
						.waitForElementVisible('@stateValue');
					this
						.getValue('@stateValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.state);
					});
					this
						.waitForElementVisible('@postcodeValue');
					this
						.getValue('@postcodeValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.postcode);
					});
					this
						.waitForElementVisible('@countryValue');
					this
						.getValue('@countryValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.country);
					});
					this
						.waitForElementVisible('@geoLatValue');
					this
						.getValue('@geoLatValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.geoLat);
					});
					this
						.waitForElementVisible('@geoLngValue');
					this
						.getValue('@geoLngValue', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.geoLng);
					});
				return this;
			},
		}],
	};

	return self;
};
