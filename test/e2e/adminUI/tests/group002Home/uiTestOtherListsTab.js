module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.otherListsTab = browser.page.home().section.otherGroup.section.otherListsTab;

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinScreen.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should have a Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.otherListsTab.expect.element('@label')
			.text.to.equal('Other Lists');
	},
	'Home view should have a + link for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.otherListsTab.expect.element('@plusIconLink')
			.to.be.visible;
	},
	'Home view should have a + icon for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.otherListsTab.expect.element('@plusIconLink')
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Other Lists tab under the Other dashboard sub-heading': function (browser) {
		browser.otherListsTab.expect.element('@itemCount')
			.text.to.equal('0 Items');
	},
};
