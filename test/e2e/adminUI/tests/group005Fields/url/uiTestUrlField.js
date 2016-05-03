var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Url field should be visible in initial modal': fieldTests.assertInitialFormUI({
		listName: 'Url',
		fields: ['name', 'fieldA']
	}),
	'restoring test state': fieldTests.restore,
};
