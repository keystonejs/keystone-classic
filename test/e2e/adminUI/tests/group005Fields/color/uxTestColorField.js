var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Color field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Color',
	}),
	'Color field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Color',
		fields: {
			'name': {value: 'Color Field Test 1'},
			'fieldA': {value: '#002147'},
		}
	}),
	'Color field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Color',
		fields: {
			'name': {value: 'Color Field Test 1'},
			'fieldA': {value: '#002147'},
		}
	}),
	'Color field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Color field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Color Color Field Test 1 created.'
	}),
	'Color field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Color',
		fields: {
			'name': {value: 'Color Field Test 1'},
			'fieldA': {value: '#002147'}
		}
	}),
	'Color field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Color',
		fields: {
			'fieldB': {value: '#f8e71c'}
		}
	}),
	'Color field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Color field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Color field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Color',
		fields: {
			'name': {value: 'Color Field Test 1'},
			'fieldA': {value: '#002147'},
			'fieldB': {value: '#f8e71c'}
		}
	})
};
