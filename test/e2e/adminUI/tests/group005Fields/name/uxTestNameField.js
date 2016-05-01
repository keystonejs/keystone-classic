var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Name field can be filled via the initial modal': fieldTests.assertInitialFormUX('Name', {firstName: 'First 1', lastName: 'Last 1'}),
	'Name field can be filled via the edit form': fieldTests.assertEditFormUX('Name', {firstName: 'First 2', lastName: 'Last 2'}),
};
