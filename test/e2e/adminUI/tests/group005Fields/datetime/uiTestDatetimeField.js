var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field should be visible in initial modal': fieldTests.assertInitialFormUI({fieldName: 'Datetime', fields: ['name', 'fieldA']}),
	'restoring test state': fieldTests.restore,
};
