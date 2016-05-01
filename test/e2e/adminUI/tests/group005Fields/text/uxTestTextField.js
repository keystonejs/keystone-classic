var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Text field can be filled via the initial modal': fieldTests.assertInitialFormUX('Text', {value: 'Text Field Test Text 1'}),
	'Text field can be filled via the edit form': fieldTests.assertEditFormUX('Text', {value: 'Text Field Test Text 1'}),
};
