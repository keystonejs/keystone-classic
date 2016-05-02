var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field should be visible in initial modal': fieldTests.assertInitialFormUI({
		listName: 'Datetime',
		fields: ['name', 'fieldA']
	}),
	'restoring test state': fieldTests.restore,
};
