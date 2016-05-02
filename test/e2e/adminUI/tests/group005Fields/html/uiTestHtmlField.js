var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field should be visible in initial modal': fieldTests.assertInitialFormUI({fieldName: 'Html', fields: ['name', 'fieldA']}),
	'restoring test state': fieldTests.restore,
};
