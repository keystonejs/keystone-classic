var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field initial modal can be opened': fieldTests.openInitialFormUX({
		listName: 'Datetime',
	}),
	'Datetime field can be filled via the initial modal': fieldTests.fillInitialFormUX({
		listName: 'Datetime',
		inputs: {
			'name': {value: 'Datetime Field Test 1'},
			'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
		}
	}),
	'Datetime field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Datetime',
		inputs: {
			'name': {value: 'Datetime Field Test 1'},
			'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
		}
	}),
	'Datetime field can be created via the initial modal': fieldTests.saveInitialFormUX(),
	'New Datetime field flash message is visible': fieldTests.assertFlashMessage({
		message: 'New Datetime Datetime Field Test 1 created.'
	}),
	'Datetime field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Datetime',
		inputs: {
			'name': {value: 'Datetime Field Test 1'},
			'fieldA': {date: '2016-01-01', time: '12:00:00 am'}
		}
	}),
	/* TODO pending a fix for issue #2715
	'Datetime field can be filled via the edit form': fieldTests.fillEditFormUX({
		listName: 'Datetime',
		inputs: {
			'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
		}
	}),
	'Datetime field changes can be saved via the edit form': fieldTests.saveEditFormUX(),
	'Updated Datetime field flash message is visible': fieldTests.assertFlashMessage({
		message: 'Your changes have been saved.'
	}),
	'Datetime field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Datetime',
		inputs: {
			'name': {value: 'Datetime Field Test 1'},
			'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
		}
	})
	*/
};
