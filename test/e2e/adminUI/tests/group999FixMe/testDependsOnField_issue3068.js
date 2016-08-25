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
	'Depends On field should work in initial form': function(browser) {
		// Create items
		browser.adminUIApp.openMiscList('DependsOn');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();


		// The dependency condition is met by default, so the dependent field should show.
		browser.initialFormScreen.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormScreen.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': true
			}
		});

		browser.initialFormScreen.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormScreen.assertUINotPresent({
			listName: 'DependsOn',
			fields: ['dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormScreen.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': false
			}
		});

		browser.initialFormScreen.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormScreen.save();
	},

	'Depends On field should work in the edit form': function(browser) {

		// The dependency condition is met, so the dependent field should show.
		browser.itemScreen.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {'editForm': false}
		});

		browser.itemScreen.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': true
			}
		});

		// The dependency condition is no longer met, field should not be visible.
		browser.itemScreen.assertUINotPresent({
			listName: 'DependsOn',
			fields: ['dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.itemScreen.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': false
			}
		});

		browser.itemScreen.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.itemScreen.save();
	}
};
