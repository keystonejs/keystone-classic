var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field should be visible in initial modal': fieldTests.assertInitialFormUI({fieldName: 'Textarea', fields: ['name', 'fieldA']}),
	'restoring test state': fieldTests.restore,
};
