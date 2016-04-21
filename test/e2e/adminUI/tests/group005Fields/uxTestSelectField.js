var adminUI = require('../../adminUI');

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
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Select field can be created via the initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForSelectsTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.initialModalView.fieldType.select.select.name.value, 'Select Field Test')
			.click(adminUI.cssSelector.initialModalView.fieldType.select.select.fieldA.inputField)
			.pause(browser.globals.defaultPauseTimeout)
			.keys(browser.globals.keyStroke.enterKey)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New Select Select Field Test created.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.select.select.name.value, function(result) {
			this.assert.equal(typeof result, "object");
			this.assert.equal(result.status, 0);
			this.assert.equal(result.value, "Select Field Test");
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.select.select.fieldA.inputValue)
			.text.to.equals('One');
	},
	'Select field can be created via the edit form': function (browser) {
		browser
			.click(adminUI.cssSelector.itemView.fieldType.select.select.fieldB.inputField)
			.pause(browser.globals.defaultPauseTimeout)
			.keys(browser.globals.keyStroke.downArrowKey)
			.pause(browser.globals.defaultPauseTimeout)
			.keys(browser.globals.keyStroke.enterKey)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.select.select.name.value, function(result) {
			this.assert.equal(typeof result, "object");
			this.assert.equal(result.status, 0);
			this.assert.equal(result.value, "Select Field Test");
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.select.select.fieldB.inputValue)
			.text.to.equals('Two');
	},
};
