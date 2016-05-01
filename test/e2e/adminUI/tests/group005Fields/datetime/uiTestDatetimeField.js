var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Datetime field should be visible in initial modal': fieldTests.assertInitialFormUI('Datetime'),
	'restoring test state': fieldTests.restore,
};
