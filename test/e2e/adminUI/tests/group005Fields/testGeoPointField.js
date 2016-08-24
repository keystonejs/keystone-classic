var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'GeoPoint field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('GeoPoint');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'GeoPoint',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'GeoPoint field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('GeoPoint');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'GeoPoint',
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'GeoPoint',
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'GeoPoint',
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
			}
		})
	},
	'GeoPoint field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'GeoPoint',
			fields: ['fieldA', 'fieldB']
		});
	},
	'GeoPoint field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'GeoPoint',
			fields: {
				'fieldB': {lat: '789', lng: '246'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'GeoPoint',
			fields: {
				'name': {value: 'GeoPoint Field Test 1'},
				'fieldA': {lat: '123', lng: '456'},
				'fieldB': {lat: '789', lng: '246'}
			}
		})
	},
};
