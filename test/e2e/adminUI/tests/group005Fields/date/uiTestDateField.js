var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Date field should be visible in initial modal': fieldTests.assertInitialFormUI('Date'),
	'restoring test state': fieldTests.restore,
};
