var DateType = require('../../fieldTypes/date');

module.exports = function DateFieldMapList(config) {
	return {
		selector: '.Form',
		sections: {
			datefield: new DateType({fieldName: 'datefield'}),
		},
	};
};
