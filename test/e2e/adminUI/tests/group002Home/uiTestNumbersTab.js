module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.numbersTab = browser.page.home().section.fieldsGroup.section.numbersTab;

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinScreen.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should have a Numbers tab under the Fields dashboard sub-heading': function (browser) {
		browser.numbersTab.expect.element('@label')
			.text.to.equal('Numbers');
	},
	'Home view should have a + link for the Numbers tab under the Fields dashboard sub-heading': function (browser) {
		browser.numbersTab.expect.element('@plusIconLink')
			.to.be.visible;
	},
	'Home view should have a + icon for the Numbers tab under the Fields dashboard sub-heading': function (browser) {
		browser.numbersTab.expect.element('@plusIconLink')
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Numbers tab under the Fields dashboard sub-heading': function (browser) {
		browser.numbersTab.expect.element('@itemCount')
			.text.to.equal('0 Items');
	},
};
