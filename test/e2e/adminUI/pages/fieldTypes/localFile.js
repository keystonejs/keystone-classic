var utils = require('../../../utils');

module.exports = function LocalFileType(config) {
	var self = {
		selector: '.field-type-localfile[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			button: '.file-toolbar .Button--default',
		},
		commands: [{
			verifyUI: function() {
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
