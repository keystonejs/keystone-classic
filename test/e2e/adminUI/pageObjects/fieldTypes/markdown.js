var utils = require('../../../utils');

module.exports = function MarkdownType(config) {
	var self = {
		selector: '.field-type-markdown[for="' + config.fieldName + '"]',
		elements: {
			label: '.FormLabel',
			value: 'textarea[name="' + config.fieldName + '.md"]',
			bold: 'button[title="Bold"]',
			italic: 'button[title="Italic"]',
			h1: 'button[title="Heading 1"]',
			h2: 'button[title="Heading 2"]',
			h3: 'button[title="Heading 3"]',
			h4: 'button[title="Heading 4"]',
			link: 'button[title="URL/Link"]',
			image: 'button[title="Image"]',
			ul: 'button[title="Unordered List"]',
			ol: 'button[title="Ordered List"]',
			quote: 'button[title="Quote"]',
			code: 'button[title="Code"]',
			previewToggle: 'button[title="Preview"]',
			preview: '.md-editor__preview'
		},
		commands: [{
			togglePreview: function(){
				return this
					.click('@previewToggle')
					.waitForElementVisible('@preview');
			},
			assertUI: function() {
				this
					.expect.element('@label').to.be.visible;
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.fieldName));
				this
					.expect.element('@value').to.be.visible;
				this
					.expect.element('@bold').to.be.visible;
				this
					.expect.element('@italic').to.be.visible;
				this
					.expect.element('@h1').to.be.visible;
				this
					.expect.element('@h2').to.be.visible;
				this
					.expect.element('@h3').to.be.visible;
				this
					.expect.element('@h4').to.be.visible;
				this
					.expect.element('@link').to.be.visible;
				this
					.expect.element('@image').to.be.visible;
				this
					.expect.element('@ul').to.be.visible;
				this
					.expect.element('@ol').to.be.visible;
				this
					.expect.element('@quote').to.be.visible;
				this
					.expect.element('@code').to.be.visible;
				this
					.expect.element('@previewToggle').to.be.visible;
				return this;
			},
			fillInput: function(input) {
				this
					.clearValue('@value')
					.setValue('@value', input.md);
				return this;
			},
			assertInput: function(input) {
				if (input.md !== undefined) {
					this
						.waitForElementVisible('@value')
						.getValue('@value', function (result) {
							this.api.assert.equal(result.state, "success");
							this.api.assert.equal(result.value, input.md);
						}.bind(this));
				} else if (input.html !== undefined) {
					this.api
						.execute(function (selector) {
							 var x = document.querySelector(selector);
							 return  x.innerHTML;
						}, [self.elements.preview], function (result) {
							this.assert.equal(result.value, input.html);
						});
				}
				return this;
			},
		}],
	};

	return self;
};
