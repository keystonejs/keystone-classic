var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.beforeUX,
	after: fieldTests.after,
	'Url field can be filled via the initial modal': fieldTests.assertInitialFormUX('Url', {value: 'www.example1.com'}),
	'Url field can be filled via the edit form': fieldTests.assertEditFormUX('Url', {value: 'www.example2.com'}),
};
