var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Location field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Location');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.section.form.section.locationList.section.fieldA.showMore();
		browser.initialFormPage.fillInputs({
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
		browser.initialFormPage.assertInputs({
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
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
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
	'Location field can be filled via the edit form': function(browser) {
		browser.itemPage.section.form.section.locationList.section.fieldB.showMore();
		browser.itemPage.fillInputs({
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
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
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
