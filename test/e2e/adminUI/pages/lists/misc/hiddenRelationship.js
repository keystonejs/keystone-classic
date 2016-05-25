var RelationshipType = require('../../fieldTypes/relationship');

module.exports = function NoDefaultColumnsList(config) {
	return {
		selector: '.Form',
		sections: {
			fieldA: new RelationshipType({fieldName: 'fieldA'}),
		},
	};
};
