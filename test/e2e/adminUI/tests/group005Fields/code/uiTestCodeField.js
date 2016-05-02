var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Code field should be visible in initial modal': fieldTests.assertInitialFormUI({
		listName: 'Code',
		fields: ['name', 'fieldA']
	}),
	'restoring test state': fieldTests.restore,
};
