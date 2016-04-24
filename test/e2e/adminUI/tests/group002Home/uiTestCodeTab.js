var adminUI = require('../../adminUI');

module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.codesTab = browser.page.home().section.fieldsGroup.section.codesTab;

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinPage');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homePage');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should have a Codes tab under the Fields dashboard sub-heading': function (browser) {
		browser.codesTab.expect.element('@label')
			.text.to.equal('Codes');
	},
	'Home view should have a + link for the Codes tab under the Fields dashboard sub-heading': function (browser) {
		browser.codesTab.expect.element('@plusIconLink')
			.to.be.visible;
	},
	'Home view should have a + icon for the Codes tab under the Fields dashboard sub-heading': function (browser) {
		browser.codesTab.expect.element('@plusIconLink')
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Codes tab under the Fields dashboard sub-heading': function (browser) {
		browser.codesTab.expect.element('@itemCount')
			.text.to.equal('0 Items');
	},
};
