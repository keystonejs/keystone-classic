var objectAssign = require('object-assign');
var DateFieldTestObject = require('../../../../fieldTestObjects/DateFieldTestObject');

module.exports = function DateFieldMapList(config) {
	return {
		datefield: new DateFieldTestObject(objectAssign({}, config, {fieldName: 'datefield'})),
	};
};
