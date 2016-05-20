var utils = require('../../../utils');

module.exports = function UrlType(config) {
	var self = {
		selector: '.field-type-geopoint[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			valueLat: 'input[name="' + config.fieldName + '[1]"][placeholder="Latitude"]',
			valueLng: 'input[name="' + config.fieldName + '[0]"][placeholder="Longitude"]',
		},
		commands: [{
			assertUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@valueLat').to.be.visible;
				this
					.expect.element('@valueLng').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this
					.clearValue('@valueLat')
					.setValue('@valueLat', input.lat);
				this
					.clearValue('@valueLng')
					.setValue('@valueLng', input.lng);
				return this;
			},
			assertInput: function(input) {
				this
					.waitForElementVisible('@valueLat');
				this
					.getValue('@valueLat', function (result) {
						this.api.assert.equal(result.state, "success");
						this.api.assert.equal(result.value, input.lat);
					});
				this
					.waitForElementVisible('@valueLng');
				this
					.getValue('@valueLng', function (result) {
						this.api.assert.equal(result.state, "success");
						this.api.assert.equal(result.value, input.lng);
					});
				return this;
			},
		}],
	};

	return self;
};
