var fieldRegistry = require('./fieldRegistry');
var fields = {};

function addField (fieldName) {
	var field = fieldRegistry[fieldName];
	Object.defineProperty(fields, fieldName, {
		enumerable: true,
		get: function () {
			return require(fieldRegistry[fieldName].Type);
		},
	});
};

fieldRegistry.fieldNames.forEach(addField);

fieldRegistry.on('added', function (event) {
	if (event.componentName === 'Type') {
		addField(event.name);
	}
});

module.exports = fields;
