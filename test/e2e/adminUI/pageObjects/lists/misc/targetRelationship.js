var objectAssign = require('object-assign');
var TextFieldTestObject = require('../../../../fieldTestObjects/TextFieldTestObject');

module.exports = function TargetRelationshipList(config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
	};
};
