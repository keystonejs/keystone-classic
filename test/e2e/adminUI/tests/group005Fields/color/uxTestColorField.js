var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Color field can be filled via the initial modal': fieldTests.assertInitialFormUX('Color', {value: '#002147'}),
	'Color field can be filled via the edit form': fieldTests.assertEditFormUX('Color', {value: '#f8e71c'}),
};
