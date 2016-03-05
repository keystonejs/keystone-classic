var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url + 'users')
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.assert.urlEquals(adminUI.url + 'signin?from=/keystone/users')
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.logoutIconLink)
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'AdminUI should allow users to login and redirect to custom url': function (browser) {
		browser
			.setValue(adminUI.cssSelectors.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelectors.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.signinView.submitButton)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.assert.urlEquals(adminUI.url + 'users');
	},
};
