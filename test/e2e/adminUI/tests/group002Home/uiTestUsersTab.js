var adminUI = require('../../adminUI');

module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.usersTab = browser.page.home().section.accessGroup.section.usersTab;

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinPage');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homePage');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should have a Users tab under the Access dashboard sub-heading': function (browser) {
		browser.usersTab.expect.element('@label')
			.text.to.equal('Users');
	},
	'Home view should have a + link for the Users tab under the Access dashboard sub-heading': function (browser) {
		browser.usersTab.expect.element('@plusIconLink')
			.to.be.visible;
	},
	'Home view should have a + icon for the Users tab under the Access dashboard sub-heading ': function (browser) {
		browser.usersTab.expect.element('@plusIconLink')
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 1 Item for the Users tab under the Access dashboard sub-heading': function (browser) {
		browser.usersTab.expect.element('@itemCount')
			.text.to.equal('1 Item');
	},
};
