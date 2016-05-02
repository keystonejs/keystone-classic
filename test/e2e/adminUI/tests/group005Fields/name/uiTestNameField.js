var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field should be visible in initial modal': fieldTests.assertInitialFormUI({
		listName: 'Name',
		fields: ['name', 'fieldA']
	}),
	'restoring test state': fieldTests.restore,
};
