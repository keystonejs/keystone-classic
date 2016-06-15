module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();

		browser.app.navigate();
		browser.app.waitForSigninScreen();

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'List items with relationships to them should allow navigating to the source relationships': function(browser) {
		browser.app.openMiscList('TargetRelationship');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'TargetRelationship',
			fields: ['name'],
		});

		browser.initialFormPage.fillInputs({
			listName: 'TargetRelationship',
			fields: {
				'name': {value: 'Test Target 1'},
			},
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.app.openMiscList('SourceRelationship');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'SourceRelationship',
			fields: ['name'],
		});

		browser.initialFormPage.fillInputs({
			listName: 'SourceRelationship',
			fields: {
				'name': {value: 'Test Source 1'},
			},
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.fillInputs({
			listName: 'SourceRelationship',
			fields: {
				'fieldA': {value: 'Test Target 1'},
				//'fieldA': {option: 'option1'},
			},
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');

		browser.app.openMiscList('TargetRelationship');
		browser.listPage.navigateToFirstItem();

		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'TargetRelationship',
			fields: {
				'name': {value: 'Test Target 1'},
			},
		});

		browser.itemPage.navitageToFirstRelationship();

		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'SourceRelationship',
			fields: {
				'name': {value: 'Select Field Test 1'},
			},
		});
	},
};
