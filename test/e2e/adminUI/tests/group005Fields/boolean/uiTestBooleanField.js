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
	'Boolean field should be visible in initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForBooleansTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.initialModalView.fieldType.bool.bool.name.label)
			.to.be.visible;
		browser.expect.element(adminUI.cssSelector.initialModalView.fieldType.bool.bool.name.label)
			.text.to.equal('Name');

		browser.expect.element(adminUI.cssSelector.initialModalView.fieldType.bool.bool.fieldA.label)
			.to.be.visible;
		browser.expect.element(adminUI.cssSelector.initialModalView.fieldType.bool.bool.fieldA.label)
			.text.to.equal('Field A');
	},
};
