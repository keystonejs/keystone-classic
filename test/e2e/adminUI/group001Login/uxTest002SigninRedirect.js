var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url + 'users')
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.assert.urlEquals(adminUI.url + 'signin?from=/keystone/users')
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'AdminUI should allow users to login and redirect to custom url': function (browser) {
		browser
			.setValue(adminUI.cssSelector.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelector.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.signinView.submitButton)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.assert.urlEquals(adminUI.url + 'users');
	},
};
