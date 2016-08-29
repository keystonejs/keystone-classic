module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.homeScreen = browser.page.homeScreen();

		browser.adminUIApp
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'AdminUI should have a home view': function (browser) {
		browser.adminUIApp.expect.element('@homeScreen')
			.to.be.visible;
	},
	'Home view should have a home icon': function (browser) {
		browser.adminUIApp.expect.element('@homeIcon')
			.to.be.visible;
	},
	'Home view should have a home icon': function (browser) {
		browser.adminUIApp.expect.element('@homeIconLink')
			.to.have.attribute('title').which.contains('Dashboard - e2e');
	},
	'Home view should have an Access menu': function (browser) {
		browser.adminUIApp.expect.element('@accessMenu')
			.text.to.equal('Access');
	},
	'Home view should have an Fields menu': function (browser) {
		browser.adminUIApp.expect.element('@fieldListsMenu')
			.text.to.equal('Fields');
	},
	'Home view should have a Front Page Icon': function (browser) {
		browser.adminUIApp.expect.element('@frontPageIcon')
			.to.be.visible;
	},
	'Home view should have a Front Page link': function (browser) {
		browser.adminUIApp.expect.element('@frontPageIconLink')
			.to.have.attribute('title').which.contains('Front page - e2e');
	},
	'Home view should have a Logout icon': function (browser) {
		browser.adminUIApp.expect.element('@logoutIcon')
			.to.be.visible;
	},
	'Home view should have a Logout link': function (browser) {
		browser.adminUIApp.expect.element('@logoutIconLink')
			.to.have.attribute('title').which.contains('Sign Out');
	},
	'Home view should have a dashboard header': function (browser) {
		browser.homeScreen.expect.element('@dashboardHeader')
			.text.to.equal('e2e');
	},
	'Home view should have a Access dashboard sub-heading': function (browser) {
		browser.homeScreen.section.accessGroup.expect.element('@subheading')
			.text.to.equal('Access');
	},
	'Home view should have a Fields dashboard sub-heading': function (browser) {
		browser.homeScreen.section.fieldsGroup.expect.element('@subheading')
			.text.to.equal('Fields');
	},
	'Home view should have a Other dashboard sub-heading': function (browser) {
		browser.homeScreen.section.otherGroup.expect.element('@subheading')
			.text.to.equal('Other');
	},
	'Home view should have tabs under Access dashboard group': function (browser) {
		browser.homeScreen.section.accessGroup.assertUI();
	},
	'Home view should have tabs under Fields dashboard group': function (browser) {
		browser.homeScreen.section.fieldsGroup.assertUI();
	},
	'Home view should have tabs under Other dashboard group': function (browser) {
		browser.homeScreen.section.otherGroup.assertUI();
	},
};
