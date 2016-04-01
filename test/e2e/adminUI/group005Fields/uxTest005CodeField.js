var adminUI = require('../adminUI');

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
	'Code field can be created via the initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForCodesTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.initialModalView.fieldType.code.code.name.value, 'Code Field Test')
			.execute(function (selector) {
				var x = document.querySelector(selector);
				var y = x.getElementsByClassName('CodeMirror')[0];
				y.CodeMirror.setValue('Some Test Code for Field A');
			}, [adminUI.cssSelector.initialModalView.fieldType.code.code.fieldA.codeMirror])
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser
			.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New Code Code Field Test created.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.code.code.name.value, function (result) {
			browser.assert.equal(result.value, 'Code Field Test');
		});

		browser
			.execute(function (selector) {
				 var x = document.querySelector(selector);
				 var y = x.getElementsByClassName('CodeMirror')[0];
				 return y.CodeMirror.getValue();
			}, [adminUI.cssSelector.itemView.fieldType.code.code.fieldA.codeMirror], function (result) {
				this.assert.equal(result.value, 'Some Test Code for Field A');
			});
	},
	'Code field can be created via the edit form': function (browser) {
		browser
			.execute(function(selector) {
				var x = document.querySelector(selector);
				var y = x.getElementsByClassName('CodeMirror')[0];
				y.CodeMirror.setValue('Some Test Code for Field B');
			}, [adminUI.cssSelector.itemView.fieldType.code.code.fieldB.codeMirror])
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.');

		browser.getValue(adminUI.cssSelector.itemView.fieldType.code.code.name.value, function(result) {
			browser.assert.equal(result.value, 'Code Field Test');
		});

		browser
			.execute(function (selector) {
				var x = document.querySelector(selector);
				var y = x.getElementsByClassName('CodeMirror')[0];
				return y.CodeMirror.getValue();
			}, [adminUI.cssSelector.itemView.fieldType.code.code.fieldB.codeMirror], function (result) {
				browser.assert.equal(result.value, 'Some Test Code for Field B');
			});
	},
};
