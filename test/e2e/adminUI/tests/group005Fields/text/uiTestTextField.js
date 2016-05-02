var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Text field should be visible in initial modal': fieldTests.assertInitialFormUI({
		listName: 'Text',
		fields: ['name', 'fieldA']
	}),
	'restoring test state': fieldTests.restore,
};
