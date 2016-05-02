var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field should be visible in initial modal': fieldTests.assertInitialFormUI({
		listName: 'Select',
		fields: ['name', 'fieldA']
	}),
	'restoring test state': fieldTests.restore,
};
