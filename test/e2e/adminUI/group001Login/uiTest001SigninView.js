var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser.page.signIn().navigate();
		browser.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.end();
	},
	'AdminUI should have a signin view': function (browser) {
		browser.page.signIn()
			.expect.element('@container').to.be.visible;
	},
	'Signin view should have an email field': function (browser) {
		browser.page.signIn()
			.expect.element('@emailInput').to.be.visible;
	},
	'Signin view should have an password field': function (browser) {
		browser.page.signIn()
			.expect.element('@passwordInput').to.be.visible;
	},
	'Signin view should have a submit button': function (browser) {
		browser.page.signIn()
			.expect.element('@submitButton').to.be.visible;
	},
};
