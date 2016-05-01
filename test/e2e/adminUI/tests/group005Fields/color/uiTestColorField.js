var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Color field should be visible in initial modal': fieldTests.assertInitialFormUI('Color'),
	'restoring test state': fieldTests.restore,
};
