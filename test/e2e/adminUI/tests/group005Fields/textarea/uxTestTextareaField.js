var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field initial modal can be opened': fieldTests.openInitialFormUX({
		listName: 'Textarea',
	}),
	'Textarea field can be filled via the initial modal': fieldTests.fillInitialFormUX({
		listName: 'Textarea',
		inputs: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Textarea field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Textarea',
		inputs: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Textarea field can be created via the initial modal': fieldTests.saveInitialFormUX(),
	'New Textarea field flash message is visible': fieldTests.assertFlashMessage({
		message: 'New Textarea Textarea Field Test 1 created.'
	}),
	'Textarea field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Textarea',
		inputs: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'}
		}
	}),
	'Textarea field can be filled via the edit form': fieldTests.fillEditFormUX({
		listName: 'Textarea',
		inputs: {
			'fieldB': {value: 'Some test text for field B'}
		}
	}),
	'Textarea field changes can be saved via the edit form': fieldTests.saveEditFormUX(),
	'Updated Textarea field flash message is visible': fieldTests.assertFlashMessage({
		message: 'Your changes have been saved.'
	}),
	'Textarea field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Textarea',
		inputs: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
			'fieldB': {value: 'Some test text for field B'}
		}
	})
};
