var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Url field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Url',
	}),
	'Url field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Url',
		fields: {
			'name': {value: 'Url Field Test 1'},
			'fieldA': {value: 'www.example1.com'},
		}
	}),
	'Url field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Url',
		fields: {
			'name': {value: 'Url Field Test 1'},
			'fieldA': {value: 'www.example1.com'},
		}
	}),
	'Url field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Url field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Url Url Field Test 1 created.'
	}),
	'Url field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Url',
		fields: {
			'name': {value: 'Url Field Test 1'},
			'fieldA': {value: 'www.example1.com'}
		}
	}),
	'Url field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Url',
		fields: {
			'fieldB': {value: 'www.example2.com'}
		}
	}),
	'Url field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Url field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Url field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Url',
		fields: {
			'name': {value: 'Url Field Test 1'},
			'fieldA': {value: 'www.example1.com'},
			'fieldB': {value: 'www.example2.com'}
		}
	})
};
