var keystone = require('../../../');
var historyAPI = require('../api/item/history');

module.exports = function (req, res) {
	var id = req.params.id;
	var items = [];

	historyAPI.getHistory(id, req.list.model.modelName, function (err, result) {
		for (var i = 0; i < result.length; i++) {

			var item = result[i];

			var change = {
				changedAt: item.t,
				changedBy: item.u ? { id: item.u._id, name: item.u.name.first + ' ' + item.u.name.last } : { id: 'null', name: 'unknown user' },
				changes: [],
			};

			for (var c = 0; c < item.c.length; c++) {
				var field = item.c[c];
				if (field !== 'updatedAt' && field !== 'updatedBy') {
					var fieldName, newValue, nextOldestValue;
					var nextOldest = result[i + 1];

					if (item.d[field] && (item.d[field].md !== undefined && item.d[field].md !== null)) {
						fieldName = field + ' (only markdown shown)';
						newValue = item.d[field].md;
						if (nextOldest) nextOldestValue = nextOldest.d[field].md;
					} else {
						fieldName = field;
						newValue = item.d[field];
						if (nextOldest) {
							nextOldestValue = nextOldest.d[field];
						}
					}

					if (newValue === '') newValue = '(deleted)';
					change.changes.push({
						fieldName: fieldName,
						newValue: newValue,
						oldValue: nextOldestValue,
					});
				}
			}
			items.push(change);
		};

		var renderView = function () {
			keystone.render(req, res, 'history', {
				section: 'home',
				page: 'home',
				orphanedLists: keystone.getOrphanedLists(),
				brand: keystone.get('name'),
				history: items,
				title: req.list.singular.toLowerCase() + ' \'' + id + '\' history',
			});
		};

		renderView();
	});
};
