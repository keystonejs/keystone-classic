module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();

		browser.app.gotoHomeScreen();
		browser.app.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'List items with relationships to them should allow navigating to the source relationships': function(browser) {
		browser.app.openMiscList('TargetRelationship');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

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
		browser.app.waitForItemScreen();

		browser.app.openMiscList('SourceRelationship');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

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
		browser.app.waitForItemScreen();

		browser.itemScreen.fillInputs({
			listName: 'SourceRelationship',
			fields: {
				'fieldA': {value: 'Test Target 1'},
				//'fieldA': {option: 'option1'},
			},
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');

		browser.app.openMiscList('TargetRelationship');
		browser.listScreen.navigateToFirstItem();

		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'TargetRelationship',
			fields: {
				'name': {value: 'Test Target 1'},
			},
		});

		browser.itemScreen.navitageToFirstRelationship();

		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'SourceRelationship',
			fields: {
				'name': {value: 'Select Field Test 1'},
			},
		});
	},
};
