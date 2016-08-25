module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'List items with relationships to them should allow navigating to the source relationships': function(browser) {
		browser.adminUIApp.openMiscList('TargetRelationship');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'TargetRelationship',
			fields: ['name'],
		});

		browser.initialFormScreen.fillInputs({
			listName: 'TargetRelationship',
			fields: {
				'name': {value: 'Test Target 1'},
			},
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.openMiscList('SourceRelationship');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'SourceRelationship',
			fields: ['name'],
		});

		browser.initialFormScreen.fillInputs({
			listName: 'SourceRelationship',
			fields: {
				'name': {value: 'Test Source 1'},
			},
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.fillInputs({
			listName: 'SourceRelationship',
			fields: {
				'fieldA': {value: 'Test Target 1'},
				//'fieldA': {option: 'option1'},
			},
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIApp.openMiscList('TargetRelationship');
		browser.listScreen.navigateToFirstItem();

		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'TargetRelationship',
			fields: {
				'name': {value: 'Test Target 1'},
			},
		});

		browser.itemScreen.navitageToFirstRelationship();

		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'SourceRelationship',
			fields: {
				'name': {value: 'Select Field Test 1'},
			},
		});
	},
};
