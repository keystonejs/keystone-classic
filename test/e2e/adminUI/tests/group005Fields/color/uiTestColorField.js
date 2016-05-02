var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Color field should be visible in initial modal': fieldTests.assertInitialFormUI({
		listName: 'Color',
		fields: ['name', 'fieldA']
	}),
	'restoring test state': fieldTests.restore,
};
