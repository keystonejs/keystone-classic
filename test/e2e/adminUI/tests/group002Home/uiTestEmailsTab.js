module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.emailsTab = browser.page.home().section.fieldsGroup.section.emailsTab;

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinPage');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homePage');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should have a Emails tab under the Fields dashboard sub-heading': function (browser) {
		browser.emailsTab.expect.element('@label')
			.text.to.equal('Emails');
	},
	'Home view should have a + link for the Emails tab under the Fields dashboard sub-heading': function (browser) {
		browser.emailsTab.expect.element('@plusIconLink')
			.to.be.visible;
	},
	'Home view should have a + icon for the Emails tab under the Fields dashboard sub-heading': function (browser) {
		browser.emailsTab.expect.element('@plusIconLink')
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Emails tab under the Fields dashboard sub-heading': function (browser) {
		browser.emailsTab.expect.element('@itemCount')
			.text.to.equal('0 Items');
	},
};
