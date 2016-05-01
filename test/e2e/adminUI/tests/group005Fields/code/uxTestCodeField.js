var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Code field can be filled via the initial modal': fieldTests.assertInitialFormUX('Code', {value: 'Some test code for field A'}),
	'Code field can be filled via the edit form': fieldTests.assertEditFormUX('Code', {value: 'Some test code for field B'}),
};
