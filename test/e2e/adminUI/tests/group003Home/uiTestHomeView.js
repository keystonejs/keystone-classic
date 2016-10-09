module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIHomeScreen = browser.page.adminUIHomeScreen();

		browser.adminUIApp.gotoSigninScreen();

		browser.adminUISigninScreen.signin();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Home view should have a dashboard header': function (browser) {
		browser.adminUIHomeScreen.expect.element('@dashboardHeader')
			.text.to.equal('e2e');
	},
	'Home view should have a Access dashboard sub-heading': function (browser) {
		browser.adminUIHomeScreen.section.accessGroup.expect.element('@subheading')
			.text.to.equal('Access');
	},
	'Home view should have a Fields dashboard sub-heading': function (browser) {
		browser.adminUIHomeScreen.section.fieldsGroup.expect.element('@subheading')
			.text.to.equal('Fields');
	},
	'Home view should have a Other dashboard sub-heading': function (browser) {
		browser.adminUIHomeScreen.section.otherGroup.expect.element('@subheading')
			.text.to.equal('Other');
	},
	'Home view should have tabs under Access dashboard group': function (browser) {
		browser.adminUIHomeScreen.section.accessGroup.assertUI();
	},
	'Home view should have tabs under Fields dashboard group': function (browser) {
		browser.adminUIHomeScreen.section.fieldsGroup.assertUI();
	},
	'Home view should have tabs under Other dashboard group': function (browser) {
		browser.adminUIHomeScreen.section.otherGroup.assertUI();
	},
};
