var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Name field should be visible in initial modal': fieldTests.assertInitialFormUI('Name'),
	'restoring test state': fieldTests.restore,
};
