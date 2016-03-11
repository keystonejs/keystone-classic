var adminUI = require('../adminUI');

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
	'Name field can be created via the initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForNamesTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.initialModalView.field.name.first, 'First1')
			.setValue(adminUI.cssSelector.initialModalView.field.name.last, 'Last1')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New Name First1 Last1 created.');
		browser.expect.element(adminUI.cssSelector.itemView.field.name.itemHeader)
			.text.to.equal('First1 Last1');
		browser.expect.element(adminUI.cssSelector.itemView.field.name.first)
			.to.have.value.that.equals('First1');
		browser.expect.element(adminUI.cssSelector.itemView.field.name.last)
			.to.have.value.that.equals('Last1');
	},
	'Name field can be created via the edit form': function (browser) {
		browser
			.setValue(adminUI.cssSelector.itemView.field.name.fieldFirst, 'First1X')
			.setValue(adminUI.cssSelector.itemView.field.name.fieldLast, 'Last1X')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.');
		browser.expect.element(adminUI.cssSelector.itemView.field.name.itemHeader)
			.text.to.equal('First1 Last1');
		browser.expect.element(adminUI.cssSelector.itemView.field.name.fieldFirst)
			.to.have.value.that.equals('First1X');
		browser.expect.element(adminUI.cssSelector.itemView.field.name.fieldLast)
			.to.have.value.that.equals('Last1X');
	},
};
