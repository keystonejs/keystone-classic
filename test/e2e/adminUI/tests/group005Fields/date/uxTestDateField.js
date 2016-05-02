var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Date',
	}),
	'Date field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Date',
		fields: {
			'name': {value: 'Date Field Test 1'},
			'fieldA': {value: '2016-01-01'},
		}
	}),
	'Date field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Date',
		fields: {
			'name': {value: 'Date Field Test 1'},
			'fieldA': {value: '2016-01-01'},
		}
	}),
	'Date field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Date field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Date Date Field Test 1 created.'
	}),
	'Date field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Date',
		fields: {
			'name': {value: 'Date Field Test 1'},
			'fieldA': {value: '2016-01-01'}
		}
	}),
	'Date field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Date',
		fields: {
			'fieldB': {value: '2016-01-02'}
		}
	}),
	'Date field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Date field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Date field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Date',
		fields: {
			'name': {value: 'Date Field Test 1'},
			'fieldA': {value: '2016-01-01'},
			'fieldB': {value: '2016-01-02'}
		}
	})
};
