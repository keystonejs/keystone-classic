module.exports = function NameList() {
	return {
		selector: '.Form',
		sections: {
			nameField: {
				selector: '.field-type-text[for="name"]',
				elements: {
					label: '.FormLabel',
					value: 'input[name="name"]',
				},
				commands: [{
					verifyUI: function () {
						this
							.expect.element('@label').to.be.visible;
						this
							.expect.element('@label').text.to.equal('Name');
						this
							.expect.element('@value').to.be.visible;
						return this;
					},
					fillInput: function (input) {
						this
							.clearValue('@value')
							.setValue('@value', input.value);
						return this;
					},
					verifyInput: function (input) {
						this
							.waitForElementVisible('@value');
						this
							.getValue('@value', function (result) {
								this.api.assert.equal(result.state, "success");
								this.api.assert.equal(result.value, input.value);
							});
						return this;
					},
				}],
			},
			fieldA: {
				selector: '.field-type-name[for="fieldA"]',
				elements: {
					label: '.FormLabel',
					firstName: 'input[name="fieldA.first"]',
					firstNamePlaceholder: 'input[placeholder="First name"]',
					lastName: 'input[name="fieldA.last"]',
					lastNamePlaceholder: 'input[placeholder="Last name"]',
				},
				commands: [{
					verifyUI: function() {
						this
							.expect.element('@label').to.be.visible;
						this
							.expect.element('@label').text.to.equal('Field A');
						this
							.expect.element('@firstName').to.be.visible;
						this
							.expect.element('@firstNamePlaceholder').to.be.visible;
						this
							.expect.element('@lastName').to.be.visible;
						this
							.expect.element('@lastNamePlaceholder').to.be.visible;
						return this;
					},
					fillInput: function(input) {
						this
							.clearValue('@firstName')
							.setValue('@firstName', input.firstName)
							.clearValue('@lastName')
							.setValue('@lastName', input.lastName);
						return this;
					},
					verifyInput: function(input) {
						this
							.getValue('@firstName', function(result) {
								this.api.assert.equal(result.value, input.firstName);
							});
						this
							.getValue('@lastName', function(result) {
								this.api.assert.equal(result.value, input.lastName);
							});
						return this;
					},
				}],
			},
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
			verifyUI: function() {
				this.expect.section('@nameField').to.be.visible;
				this.expect.section('@fieldA').to.be.visible;
			}
		}],
	};
};
