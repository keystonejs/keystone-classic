var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Textarea field should be visible in initial modal': fieldTests.assertInitialFormUI('Textarea'),
	'restoring test state': fieldTests.restore,
};
