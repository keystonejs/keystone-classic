var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Select field should be visible in initial modal': fieldTests.assertInitialFormUI('Select'),
	'restoring test state': fieldTests.restore,
};
