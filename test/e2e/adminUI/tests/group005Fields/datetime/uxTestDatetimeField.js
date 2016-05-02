var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Datetime',
		inputs: {
			'name': {value: 'Datetime Field Test 1'},
			'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
		}
	}),
	// Pending fix for #2715
	//'Datetime field can be filled via the edit form': fieldTests.assertEditFormUX('Datetime', {
	//	listName: 'Datetime',
	//	inputs: {
	//		'fieldB': {date: '2016-01-02', time: '12:00:00 am'},
	//	}
	//}),
};
