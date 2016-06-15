var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var HiddenBoolean = new keystone.List('HiddenBoolean');

HiddenBoolean.add({
	fieldA: { type: Types.Boolean, hidden: true, default: true },
	fieldB: { type: String, initial: true, dependsOn: {fieldA: true} },
});

HiddenBoolean.register();
module.exports = HiddenBoolean;
