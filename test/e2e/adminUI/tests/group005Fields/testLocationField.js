var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Location');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUIVisible({
			listName: 'Location',
			fields: ['name', 'fieldA'],
			args: { 'showMore': false },
		});

		browser.initialFormScreen.showMoreFields({
			listName: 'Location',
			fields: ['fieldA'],
		});

		browser.initialFormScreen.assertUIVisible({
			listName: 'Location',
			fields: ['name', 'fieldA'],
			args: { 'showMore': true },
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Location field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Location');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.showMoreFields({
			listName: 'Location',
			fields: ['fieldA'],
		});
		browser.initialFormScreen.fillInputs({
			listName: 'Location',
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
		browser.initialFormScreen.assertInputs({
			listName: 'Location',
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
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Location',
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
		browser.itemScreen.assertUIVisible({
			listName: 'Location',
			fields: ['fieldA'],
			args: { 'showMore': true },
		});
		browser.itemScreen.assertUIVisible({
			listName: 'Location',
			fields: ['fieldB'],
			args: { 'showMore': false },
		});
		browser.itemScreen.showMoreFields({
			listName: 'Location',
			fields: ['fieldB'],
		});
		browser.itemScreen.assertUIVisible({
			listName: 'Location',
			fields: ['fieldB'],
			args: { 'showMore': true },
		});
	},
	'Location field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Location',
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
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Location',
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
