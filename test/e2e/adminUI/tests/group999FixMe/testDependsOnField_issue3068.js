module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Depends On field should work in initial form': function(browser) {
		// Create items
		browser.app.openMiscList('DependsOn');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();


		// The dependency condition is met by default, so the dependent field should show.
		browser.initialFormPage.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormPage.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': true
			}
		});

		browser.initialFormPage.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormPage.assertUINotPresent({
			listName: 'DependsOn',
			fields: ['dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormPage.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': false
			}
		});

		browser.initialFormPage.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.initialFormPage.save();
	},

	'Depends On field should work in the edit form': function(browser) {

		// The dependency condition is met, so the dependent field should show.
		browser.itemPage.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {'editForm': false}
		});

		browser.itemPage.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': true
			}
		});

		// The dependency condition is no longer met, field should not be visible.
		browser.itemPage.assertUINotPresent({
			listName: 'DependsOn',
			fields: ['dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.itemPage.fillInputs({
			listName: 'DependsOn',
			fields: {
				'dependency': false
			}
		});

		browser.itemPage.assertUIVisible({
			listName: 'DependsOn',
			fields: ['dependency', 'dependent'],
			args: {
				'editForm': false,
			}
		});

		browser.itemPage.save();
	}
};
