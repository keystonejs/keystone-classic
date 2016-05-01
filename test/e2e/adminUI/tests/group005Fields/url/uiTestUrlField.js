var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUI,
	after: fieldTests.after,
	'Url field should be visible in initial modal': fieldTests.assertInitialFormUI('Url'),
	'restoring test state': fieldTests.restore,
};
