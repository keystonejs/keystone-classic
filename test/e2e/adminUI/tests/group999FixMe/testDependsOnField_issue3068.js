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
	'Depends On field should work in initial form': function(browser) {
		// Create items
		browser.adminUIApp.openList({section: 'Miscs', list: 'DependsOn'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();


		// The dependency condition is met by default, so the dependent field should show.
		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': true
			}
		});

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			listName: 'DependsOn',
			fields: ['dependency'],
			args: {
				'editForm': false,
			}
		});

		browser.adminUIInitialFormScreen.assertFieldDOMNotPresent({
			listName: 'DependsOn',
			fields: ['dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': false
			}
		});

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.adminUIInitialFormScreen.save();
	},

	'Depends On field should work in the edit form': function(browser) {

		// The dependency condition is met, so the dependent field should show.
		browser.adminUIItemScreen.assertFieldUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {'editForm': false}
		});

		browser.adminUIItemScreen.fillFieldInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': true
			}
		});

		// The dependency condition is no longer met, field should not be visible.
		browser.adminUIItemScreen.assertFieldDOMNotPresent({
			listName: 'DependsOn',
			fields: ['dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.adminUIItemScreen.fillFieldInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': false
			}
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.adminUIItemScreen.save();
	}
};
