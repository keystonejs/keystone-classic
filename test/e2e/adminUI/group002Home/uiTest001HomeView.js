var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.setValue(adminUI.cssSelectors.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelectors.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'AdminUI should have a home view': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.id)
			.to.be.visible;
	},
	'Home view should have a home link': function (browser) {
		browser.expect.element(adminUI.cssSelectors.allView.homeIconLink)
			.to.be.visible;
	},
	'Home view should have a home icon': function (browser) {
		browser.expect.element(adminUI.cssSelectors.allView.homeIconLink)
			.to.have.attribute('class').which.contains('octicon octicon-home');
	},
	'Home view should have an Access menu': function (browser) {
		browser.expect.element(adminUI.cssSelectors.allView.accessMenu)
			.text.to.equal('Access');
	},
	'Home view should have an Fields menu': function (browser) {
		browser.expect.element(adminUI.cssSelectors.allView.fieldsMenu)
			.text.to.equal('Fields');
	},
	'Home view should have a Front Page link': function (browser) {
		browser.expect.element(adminUI.cssSelectors.allView.frontPageIconLink)
			.to.be.visible;
	},
	'Home view should have a Logout link': function (browser) {
		browser.expect.element(adminUI.cssSelectors.allView.logoutIconLink)
			.to.be.visible;
	},
	'Home view should have a dashboard header': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.dashboardHeader)
			.text.to.equal('e2e');
	},
	'Home view should have a Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.dashboardAccessSubheading)
			.text.to.equal('Access');
	},
	'Home view should have a Users tab under the Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.usersTabUnderDashboardAccessSubheading)
			.text.to.equal('Users');
	},
	'Home view should have a + link for the Users tab under the Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.plusIconLinkForUsersTabUnderDashboardAccessSubheading)
			.to.be.visible;
	},
	'Home view should have a + icon for the Users tab under the Access dashboard sub-heading ': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.plusIconLinkForUsersTabUnderDashboardAccessSubheading)
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 1 Item for the Users tab under the Access dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.itemCountForUsersTabUnderDashboardAccessSubheading)
			.text.to.equal('1 Item');
	},
	'Home view should have a Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.dashboardFieldsSubheading)
			.text.to.equal('Fields');
	},
	'Home view should have a Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.nameFieldsTabUnderDashboardFieldsSubheading)
			.text.to.equal('Name Fields');
	},
	'Home view should have a + link for the Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.plusIconLinkForNameFieldsTabUnderDashboardFieldsSubheading)
			.to.be.visible;
	},
	'Home view should have a + icon for the Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.plusIconLinkForNameFieldsTabUnderDashboardFieldsSubheading)
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Name Fields tab under the Fields dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.itemCountForNameFieldsTabUnderDashboardFieldsSubheading)
			.text.to.equal('0 Items');
	},
	'Home view should have a Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.dashboardOthersSubheading)
			.text.to.equal('Other');
	},
	'Home view should have a Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.otherListsTabUnderDashboardOthersSubheading)
			.text.to.equal('Other Lists');
	},
	'Home view should have a + link for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.plusIconLinkForOtherListsTabUnderDashboardOthersSubheading)
			.to.be.visible;
	},
	'Home view should have a + icon for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.plusIconLinkForOtherListsTabUnderDashboardOthersSubheading)
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.expect.element(adminUI.cssSelectors.homeView.itemCountForOtherListsTabUnderDashboardOthersSubheading)
			.text.to.equal('0 Items');
	},
};
