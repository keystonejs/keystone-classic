module.exports = function (req, res, next) {
	if (req.method.toUpperCase() != 'POST') return next();

	var nativeKeystoneFields = [
		// Name field
		'.first',
		'.last',
		'.full'
	];

	var fields = {};
	var nestMapper = {};

	Object.keys(req.body).forEach((key) => {
		var props = key.split('.');
		if (props.length == 1) return;

		hasNativeField = nativeKeystoneFields.filter(function (field) { return key.indexOf(field) >= 0 });
		if (hasNativeField.length > 0) return;

		var parentProp = props.splice(0, 1)[0];

		if (!fields[parentProp]) fields[parentProp] = {};

		var currentContext = fields[parentProp];

		for (var i = 0; i < props.length; i++) {
			var subProp = getSubProp(props[i]);

			if (!currentContext[subProp.id]) currentContext[subProp.id] = {};
			if (i != (props.length - 1)){
				if (!currentContext[subProp.id][subProp.prop]) currentContext[subProp.id][subProp.prop] = {};
				nestMapper[subProp.prop] = 'nested';
			} else {
				currentContext[subProp.id][subProp.prop] = req.body[key];
				break;
			}

			currentContext = currentContext[subProp.id][subProp.prop];
		}
	});

	Object.keys(fields).forEach((field) => {
		if (!req.body[field]) req.body[field] = [];

		var values = fields[field];

		Object.keys(values).forEach((value) => {
			var actualField =  values[value];

			Object.keys(actualField).forEach((fieldKey) => {
				if (nestMapper[fieldKey] && nestMapper[fieldKey] == 'nested') actualField[fieldKey] = fieldBuilder(actualField[fieldKey]);
			});

			req.body[field].push(actualField);
		});
	});

	function fieldBuilder(values) {
		var fields = [];

		Object.keys(values).forEach((value) => {
			var actualField = values[value];
			if (nestMapper[value] && nestMapper[value] == 'nested') actualField = fieldBuilder(values[value]);
			fields.push(actualField);
		});

		return fields;
	}

	function getSubProp(prop) {
		var props = prop.split('_');
		return { prop: props[0], id: props[1] };
	}

	return next();
}

