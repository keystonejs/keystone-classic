var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.end();
	},
	'AdminUI should allow users to login': function (browser) {
		browser
			.setValue(adminUI.cssSelector.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelector.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)  // just in case we're redirected somewhere other than home page
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'AdminUI should allow users to logout': function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
};
