module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'List items with relationships to them should allow navigating to the source relationships': function(browser) {
		browser.adminUIApp.openList({section: 'Miscs', list: 'TargetRelationship'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertUI({
			listName: 'TargetRelationship',
			fields: ['name'],
		});

		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'TargetRelationship',
			fields: {
				'name': {value: 'Test Target 1'},
			},
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.openList({section: 'Miscs', list: 'SourceRelationship'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertUI({
			listName: 'SourceRelationship',
			fields: ['name'],
		});

		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'SourceRelationship',
			fields: {
				'name': {value: 'Test Source 1'},
			},
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.fillFieldInputs({
			listName: 'SourceRelationship',
			fields: {
				'fieldA': {value: 'Test Target 1'},
				//'fieldA': {option: 'option1'},
			},
		});
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.adminUIItemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.adminUIApp.openList({section: 'Miscs', list: 'TargetRelationship'});
		browser.adminUIListScreen.navigateToFirstItem();

		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			listName: 'TargetRelationship',
			fields: {
				'name': {value: 'Test Target 1'},
			},
		});

		browser.adminUIItemScreen.navitageToFirstRelationship();

		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertFieldInputs({
			listName: 'SourceRelationship',
			fields: {
				'name': {value: 'Select Field Test 1'},
			},
		});
	},
};
