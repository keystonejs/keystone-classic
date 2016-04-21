var adminUI = require('../../adminUI');

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
	'Email field can be created via the initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForEmailsTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.initialModalView.fieldType.email.email.name.value, 'Email Field Test')
			.setValue(adminUI.cssSelector.initialModalView.fieldType.email.email.fieldA.value, 'email1@test.e2e')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New Email Email Field Test created.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.email.email.name.value, function(result) {
			this.assert.equal(result.value, 'Email Field Test');
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.email.email.fieldA.value)
			.to.have.value.that.equals('email1@test.e2e');
	},
	'Email field can be created via the edit form': function (browser) {
		browser
			.setValue(adminUI.cssSelector.itemView.fieldType.email.email.fieldB.value, 'email2@test.e2e')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.email.email.name.value, function(result) {
			this.assert.equal(result.value, 'Email Field Test');
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.email.email.fieldB.value)
			.to.have.value.that.equals('email2@test.e2e');
	},
};
