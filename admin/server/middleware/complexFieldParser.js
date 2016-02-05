module.exports = function (req, res, next) {
	if (req.method.toUpperCase() != 'POST') return next();

	var fields = {};

	Object.keys(req.body).forEach((key) => {
		var props = key.split('.');
		if (props.length == 1) return;

		var parentProp = props[0];
		var subProps = props[1].split('_');
		var subProp = subProps[0];
		var id = subProps[1];

		if (!fields[parentProp]) fields[parentProp] = {};
		if (!fields[parentProp][id]) fields[parentProp][id] = {};

		fields[parentProp][id][subProp] = req.body[key];
	});

	Object.keys(fields).forEach((field) => {
		if (!req.body[field]) req.body[field] = [];

		var values = fields[field];

		Object.keys(values).forEach((value) => {
			req.body[field].push(values[value]);
		});
	});

	return next();
}
