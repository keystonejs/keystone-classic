var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Text field should be visible in initial modal': fieldTests.assertInitialFormUI('Text'),
	'restoring test state': fieldTests.restore,
};
