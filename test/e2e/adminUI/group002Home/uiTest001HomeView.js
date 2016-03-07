var adminUI = require('../adminUI');

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
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'AdminUI should have a home view': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.id)
			.to.be.visible;
	},
	'Home view should have a home link': function (browser) {
		browser.expect.element(adminUI.cssSelector.allView.homeIconLink)
			.to.be.visible;
	},
	'Home view should have a home icon': function (browser) {
		browser.expect.element(adminUI.cssSelector.allView.homeIconLink)
			.to.have.attribute('class').which.contains('octicon octicon-home');
	},
	'Home view should have an Access menu': function (browser) {
		browser.expect.element(adminUI.cssSelector.allView.accessMenu)
			.text.to.equal('Access');
	},
	'Home view should have an Fields menu': function (browser) {
		browser.expect.element(adminUI.cssSelector.allView.fieldsMenu)
			.text.to.equal('Fields');
	},
	'Home view should have a Front Page link': function (browser) {
		browser.expect.element(adminUI.cssSelector.allView.frontPageIconLink)
			.to.be.visible;
	},
	'Home view should have a Logout link': function (browser) {
		browser.expect.element(adminUI.cssSelector.allView.logoutIconLink)
			.to.be.visible;
	},
	'Home view should have a dashboard header': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.dashboardHeader)
			.text.to.equal('e2e');
	},
	'Home view should have a Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.dashboardAccessSubheading)
			.text.to.equal('Access');
	},
	'Home view should have a Users tab under the Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.usersTabUnderDashboardAccessSubheading)
			.text.to.equal('Users');
	},
	'Home view should have a + link for the Users tab under the Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.plusIconLinkForUsersTabUnderDashboardAccessSubheading)
			.to.be.visible;
	},
	'Home view should have a + icon for the Users tab under the Access dashboard sub-heading ': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.plusIconLinkForUsersTabUnderDashboardAccessSubheading)
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 1 Item for the Users tab under the Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.itemCountForUsersTabUnderDashboardAccessSubheading)
			.text.to.equal('1 Item');
	},
	'Home view should have a Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.dashboardFieldsSubheading)
			.text.to.equal('Fields');
	},
	'Home view should have a Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.nameFieldsTabUnderDashboardFieldsSubheading)
			.text.to.equal('Name Fields');
	},
	'Home view should have a + link for the Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.plusIconLinkForNameFieldsTabUnderDashboardFieldsSubheading)
			.to.be.visible;
	},
	'Home view should have a + icon for the Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.plusIconLinkForNameFieldsTabUnderDashboardFieldsSubheading)
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.itemCountForNameFieldsTabUnderDashboardFieldsSubheading)
			.text.to.equal('0 Items');
	},
	'Home view should have a Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.dashboardOthersSubheading)
			.text.to.equal('Other');
	},
	'Home view should have a Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.otherListsTabUnderDashboardOthersSubheading)
			.text.to.equal('Other Lists');
	},
	'Home view should have a + link for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.plusIconLinkForOtherListsTabUnderDashboardOthersSubheading)
			.to.be.visible;
	},
	'Home view should have a + icon for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.plusIconLinkForOtherListsTabUnderDashboardOthersSubheading)
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelector.homeView.itemCountForOtherListsTabUnderDashboardOthersSubheading)
			.text.to.equal('0 Items');
	},
};
