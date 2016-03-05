var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.setValue(adminUI.cssSelectors.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelectors.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Name field should be visible in initial modal': function (browser) {
		browser
			.click(adminUI.cssSelectors.homeView.plusIconLinkForNameFieldsTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelectors.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.initialModalView.field.name.label)
			.to.be.visible;
		browser.expect.element(adminUI.cssSelectors.initialModalView.field.name.label)
			.text.to.equal('Name');

		browser.expect.element(adminUI.cssSelectors.initialModalView.field.name.first)
			.to.be.visible;
		browser.expect.element(adminUI.cssSelectors.initialModalView.field.name.firstPlaceholder)
			.to.be.visible;

		browser.expect.element(adminUI.cssSelectors.initialModalView.field.name.last)
			.to.be.visible;
		browser.expect.element(adminUI.cssSelectors.initialModalView.field.name.lastPlaceholder)
			.to.be.visible;
	},
};
