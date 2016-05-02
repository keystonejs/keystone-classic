module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.booleansTab = browser.page.home().section.fieldsGroup.section.booleansTab;

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinScreen.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should have a Booleans tab under the Fields dashboard sub-heading': function (browser) {
		browser.booleansTab.expect.element('@label')
			.text.to.equal('Booleans');
	},
	'Home view should have a + link for the Booleans tab under the Fields dashboard sub-heading': function (browser) {
		browser.booleansTab.expect.element('@plusIconLink')
			.to.be.visible;
	},
	'Home view should have a + icon for the Booleans tab under the Fields dashboard sub-heading': function (browser) {
		browser.booleansTab.expect.element('@plusIconLink')
			.to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
	},
	'Home view should show 0 Items for the Booleans tab under the Fields dashboard sub-heading': function (browser) {
		browser.booleansTab.expect.element('@itemCount')
			.text.to.equal('0 Items');
	},
};
