var fieldTests = require('./commonFieldTestUtils.js');
var LocationModelTestConfig = require('../../../modelTestConfig/LocationModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Location');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{name: 'name'},
				{
					name: 'fieldA',
					options: {showMore: false}
				}
			],
		});

		browser.initialFormScreen.clickFieldUI({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldA': {'click': 'showMore'},
			}
		});

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{name: 'name'},
				{
					name: 'fieldA',
					options: {showMore: true}
				}
			],
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Location field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Location');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.clickFieldUI({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldA': {'click': 'showMore'},
			}
		});
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
					'number': 'Field A',
					'name': 'Building A',
					'street1': 'Street A',
					'street2': 'Town A',
					'suburb': 'Suburb A',
					'state': 'State A',
					'postcode': 'AAA AAA',
					'country': 'AAA',
					'geoLat': '123',
					'geoLng': '123'
				},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
					'number': 'Field A',
					'name': 'Building A',
					'street1': 'Street A',
					'street2': 'Town A',
					'suburb': 'Suburb A',
					'state': 'State A',
					'postcode': 'AAA AAA',
					'country': 'AAA',
					'geoLat': '123',
					'geoLng': '123'
				},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
					'number': 'Field A',
					'name': 'Building A',
					'street1': 'Street A',
					'street2': 'Town A',
					'suburb': 'Suburb A',
					'state': 'State A',
					'postcode': 'AAA AAA',
					'country': 'AAA',
					'geoLat': '123',
					'geoLng': '123'
				},
			}
		})
	},
	'Location field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{
					name: 'fieldA',
					options: {showMore: true}
				},
				{
					name: 'fieldB',
					options: {showMore: false}
				}
			],
		});
		browser.itemScreen.clickFieldUI({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldB': {'click': 'showMore'},
			}
		});
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: LocationModelTestConfig,
			fields: [
				{
					name: 'fieldA',
					options: {showMore: true}
				},
				{
					name: 'fieldB',
					options: {showMore: true}
				}
			],
		});
	},
	'Location field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'fieldB': {
					'number': 'Field B',
					'name': 'Building B',
					'street1': 'Street B',
					'street2': 'Town B',
					'suburb': 'Suburb B',
					'state': 'State B',
					'postcode': 'BBB BBB',
					'country': 'BBB',
					'geoLat': '123',
					'geoLng': '123'
				},
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: LocationModelTestConfig,
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
					'number': 'Field A',
					'name': 'Building A',
					'street1': 'Street A',
					'street2': 'Town A',
					'suburb': 'Suburb A',
					'state': 'State A',
					'postcode': 'AAA AAA',
					'country': 'AAA',
					'geoLat': '123',
					'geoLng': '123'
				},
				'fieldB': {
					'number': 'Field B',
					'name': 'Building B',
					'street1': 'Street B',
					'street2': 'Town B',
					'suburb': 'Suburb B',
					'state': 'State B',
					'postcode': 'BBB BBB',
					'country': 'BBB',
					'geoLat': '123',
					'geoLng': '123'
				},
			}
		})
	},
};
