var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Code field should be visible in initial modal': fieldTests.assertInitialFormUI('Code'),
	'restoring test state': fieldTests.restore,
};
