var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/LocationModelTestConfig');

module.exports = {
	'@disabled': true,
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Location' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', options: { showMore: false }, },
			],
		});

		browser.adminUIInitialFormScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', click: 'showMore', }
			],
		});

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', options: { showMore: true }, },
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Location field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Location' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.clickFieldUI({
			fields: [
				{ name: 'fieldA', click: 'showMore', }
			],
		});

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Location Field Test 1' }, },
				{
					name: 'fieldA', input: {
						'number': 'Field A',
						'name': 'Building A',
						'street1': 'Street A',
						'street2': 'Town A',
						'suburb': 'Suburb A',
						'state': 'State A',
						'postcode': 'AAA AAA',
						'country': 'AAA',
						'geoLat': '90',
						'geoLng': '100'
					},
				},
			],
		});

		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Location Field Test 1' }, },
				{
					name: 'fieldA', input: {
						'number': 'Field A',
						'name': 'Building A',
						'street1': 'Street A',
						'street2': 'Town A',
						'suburb': 'Suburb A',
						'state': 'State A',
						'postcode': 'AAA AAA',
						'country': 'AAA',
						'geoLat': '90',
						'geoLng': '100'
					},
				},
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Location field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', options: { showMore: true }, },
				{ name: 'fieldB', options: { showMore: false }, },
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Location Field Test 1' }, },
				{
					name: 'fieldA', input: {
						'number': 'Field A',
						'name': 'Building A',
						'street1': 'Street A',
						'street2': 'Town A',
						'suburb': 'Suburb A',
						'state': 'State A',
						'postcode': 'AAA AAA',
						'country': 'AAA',
						'geoLat': '90',
						'geoLng': '100'
					},
				},
			],
		});

		browser.adminUIItemScreen.clickFieldUI({
			fields: [
				{ name: 'fieldB', click: 'showMore', }
			],
		});

		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', options: { showMore: true }, },
				{ name: 'fieldB', options: { showMore: true }, },
			],
		});
	},
	'Location field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Location Field Test 1' }, },
				{
					name: 'fieldB', input: {
						'number': 'Field B',
						'name': 'Building B',
						'street1': 'Street B',
						'street2': 'Town B',
						'suburb': 'Suburb B',
						'state': 'State B',
						'postcode': 'BBB BBB',
						'country': 'BBB',
						'geoLat': '90',
						'geoLng': '100'
					},
				},
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Location Field Test 1' }, },
				{
					name: 'fieldA', input: {
						'number': 'Field A',
						'name': 'Building A',
						'street1': 'Street A',
						'street2': 'Town A',
						'suburb': 'Suburb A',
						'state': 'State A',
						'postcode': 'AAA AAA',
						'country': 'AAA',
						'geoLat': '90',
						'geoLng': '100'
					},
				},
				{
					name: 'fieldB', input: {
						'number': 'Field B',
						'name': 'Building B',
						'street1': 'Street B',
						'street2': 'Town B',
						'suburb': 'Suburb B',
						'state': 'State B',
						'postcode': 'BBB BBB',
						'country': 'BBB',
						'geoLat': '90',
						'geoLng': '100'
					},
				},
			],
		});
	},
};
