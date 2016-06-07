var keystone = require('../../../');
var historyAPI = require('../api/item/history');

module.exports = function (req, res) {
	var id = req.params.id;
	var items = [];

	historyAPI.getHistory(id, req.list.model.modelName, function (err, result) {
		result.forEach(function (item) {
			var change = {
				changedAt: item.t,
				changedBy: item.u ? { id: item.u._id, name: item.u.name.first + ' ' + item.u.name.last } : { id: 'null', name: 'null' },
				changes: [],
			};

			item.c.forEach(function (field) {
				if (field !== 'updatedAt' && field !== 'updatedBy') {
					var fieldName, newValue;

					if (item.d[field].md !== undefined && item.d[field].md !== null) {
						fieldName = field + ' (markdown shown)';
						newValue = item.d[field].md;
					} else {
						fieldName = field;
						newValue = item.d[field];
					}

					if (newValue === '') newValue = '(deleted)';

					change.changes.push({
						fieldName: fieldName,
						newValue: newValue,
					});
				}
			});
			items.push(change);
		});

		var renderView = function () {
			var appName = keystone.get('name') || 'Keystone';
			keystone.render(req, res, 'history', {
				history: items,
				title: appName + ' ' + req.list.singular.toLowerCase() + ' \'' + id + '\' history',
			});
		};

		renderView();
	});
};
