var utils = require('../../../utils');

module.exports = function CloudinaryImageType(config) {
	return {
		selector: '.field-type-cloudinaryimage[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			button: '.image-toolbar button',
		},
		commands: [{
			assertUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@button').to.be.visible;
				return this;
			},
		}],
	};
};
