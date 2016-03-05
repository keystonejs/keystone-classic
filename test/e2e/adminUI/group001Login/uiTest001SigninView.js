var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url);
	},
	after: function (browser) {
		browser
			.end();
	},
	'AdminUI should have a signin view': function (browser) {
		browser
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'Signin view should have an email field': function (browser) {
		browser.expect.element(adminUI.cssSelectors.signinView.emailInput).to.be.visible;
	},
	'Signin view should have an password field': function (browser) {
		browser.expect.element(adminUI.cssSelectors.signinView.passwordInput).to.be.visible;
	},
	'Signin view should have a submit button': function (browser) {
		browser.expect.element(adminUI.cssSelectors.signinView.submitButton).to.be.visible;
	},
};
