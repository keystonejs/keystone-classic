var utils = require('../../../utils');

module.exports = function LocalFileMultipleType(config) {
	var self = {
		selector: '.field-type-localfiles[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			button: '.files-toolbar .Button--default',
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

	return self;
};
