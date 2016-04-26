var adminUI = require('../../../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.setValue(adminUI.cssSelector.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelector.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Text field can be created via the initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForTextsTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.initialModalView.fieldType.text.text.name.value, 'Text Field Test')
			.setValue(adminUI.cssSelector.initialModalView.fieldType.text.text.fieldA.value, 'Test Text 1')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New Text Text Field Test created.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.text.text.name.value, function(result) {
			this.assert.equal(result.value, 'Text Field Test');
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.text.text.fieldA.value)
			.to.have.value.that.equals('Test Text 1');
	},
	'Text field can be created via the edit form': function (browser) {
		browser
			.setValue(adminUI.cssSelector.itemView.fieldType.text.text.fieldB.value, 'Test Text 2')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.text.text.name.value, function(result) {
			this.assert.equal(result.value, 'Text Field Test');
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.text.text.fieldB.value)
			.to.have.value.that.equals('Test Text 2');
	},
};
