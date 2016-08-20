var BooleanField = require('../../../../fieldTestObjects/booleanField');
var SelectType = require('../../fieldTypes/select');

module.exports = function DependsOnList(config) {
	return {
		selector: '.Form',
		sections: {
			dependency: new BooleanField({fieldName: 'dependency'}),
			dependent: new SelectType({fieldName: 'dependent'}),
		},
	};
};
