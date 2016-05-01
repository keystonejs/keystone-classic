var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Select field can be filled via the initial modal': fieldTests.assertInitialFormUX('Select', {value: 'One'}),
	'Select field can be filled via the edit form': fieldTests.assertEditFormUX('Select', {value: 'Two'}),
};
