var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Date field can be filled via the initial modal': fieldTests.assertInitialFormUX('Date', {value: '2016-01-01'}),
	'Date field can be filled via the edit form': fieldTests.assertEditFormUX('Date', {value: '2016-01-02'}),
};
