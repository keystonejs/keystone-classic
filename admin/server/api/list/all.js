
module.exports = function (req, res) {
	var result = {};

	var lists = req.list;

	for (var l in lists) {
		if (lists.hasOwnProperty(l)) {
			var item = lists[l];

			result[item.key] = {
				name: item.key,
				path: item.path,
				fields: item.fieldTypes,
			};
		}
	}

	res.json(result);
};
