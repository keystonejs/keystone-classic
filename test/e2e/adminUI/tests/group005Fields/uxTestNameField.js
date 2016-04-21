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
	'Name field can be created via the initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForNamesTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.initialModalView.fieldType.name.name.name.value, 'Name Field Test')
			.setValue(adminUI.cssSelector.initialModalView.fieldType.name.name.fieldA.first, 'First1')
			.setValue(adminUI.cssSelector.initialModalView.fieldType.name.name.fieldA.last, 'Last1')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New Name Name Field Test created.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.name.name.name.value, function(result) {
			this.assert.equal(typeof result, "object");
			this.assert.equal(result.status, 0);
			this.assert.equal(result.value, "Name Field Test");
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.name.name.fieldA.first)
			.to.have.value.that.equals('First1');
		browser.expect.element(adminUI.cssSelector.itemView.fieldType.name.name.fieldA.last)
			.to.have.value.that.equals('Last1');
	},
	'Name field can be created via the edit form': function (browser) {
		browser
			.setValue(adminUI.cssSelector.itemView.fieldType.name.name.fieldB.first, 'First1X')
			.setValue(adminUI.cssSelector.itemView.fieldType.name.name.fieldB.last, 'Last1X')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.name.name.name.value, function(result) {
			this.assert.equal(typeof result, "object");
			this.assert.equal(result.status, 0);
			this.assert.equal(result.value, "Name Field Test");
		});

		browser.expect.element(adminUI.cssSelector.itemView.fieldType.name.name.fieldB.first)
			.to.have.value.that.equals('First1X');
		browser.expect.element(adminUI.cssSelector.itemView.fieldType.name.name.fieldB.last)
			.to.have.value.that.equals('Last1X');
	},
};
