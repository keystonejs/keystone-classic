var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Html field should be visible in initial modal': fieldTests.assertInitialFormUI('Html'),
	'restoring test state': fieldTests.restore,
};
