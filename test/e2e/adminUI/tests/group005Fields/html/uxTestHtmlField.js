var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Html field can be filled via the initial modal': fieldTests.assertInitialFormUX('Html', {value: 'Test html code 1'}),
	'Html field can be filled via the edit form': fieldTests.assertEditFormUX('Html', {value: 'Test html code 2'}),
};
