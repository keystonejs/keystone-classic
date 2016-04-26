module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.selectsTab = browser.page.home().section.fieldsGroup.section.selectsTab;

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinPage');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homePage');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should have a Selects tab under the Fields dashboard sub-heading': function (browser) {
		browser.selectsTab.expect.element('@label')
			.text.to.equal('Selects');
	},
	'Home view should have a + link for the Selects tab under the Fields dashboard sub-heading': function (browser) {
		browser.selectsTab.expect.element('@plusIconLink')
			.to.be.visible;
	},
	'Home view should have a + icon for the Selects tab under the Fields dashboard sub-heading': function (browser) {
		browser.selectsTab.expect.element('@plusIconLink')
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Selects tab under the Fields dashboard sub-heading': function (browser) {
		browser.selectsTab.expect.element('@itemCount')
			.text.to.equal('0 Items');
	},
};
