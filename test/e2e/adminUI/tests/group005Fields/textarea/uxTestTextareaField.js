var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Textarea field can be filled via the initial modal': fieldTests.assertInitialFormUX('Textarea', {value: 'Textarea Field Test 1'}),
	'Textarea field can be filled via the edit form': fieldTests.assertEditFormUX('Textarea', {value: 'Textarea Field Test 2'}),
};
