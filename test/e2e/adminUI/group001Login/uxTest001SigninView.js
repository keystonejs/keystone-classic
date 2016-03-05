var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.end();
	},
	'AdminUI should allow users to login': function (browser) {
		browser
			.setValue(adminUI.cssSelectors.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelectors.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)  // just in case we're redirected somewhere other than home page
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'AdminUI should allow users to logout': function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.logoutIconLink)
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
};
