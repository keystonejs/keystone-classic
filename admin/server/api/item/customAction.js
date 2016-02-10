var	keystone = require('../../../../');
var	_ = require('underscore');
var	evalDependsOn = require('../../../../fields/utils/evalDependsOn');

function fireAction (item, customAction, req, res, cb) {
	req.item = item;
	try {
		if (!evalDependsOn(customAction.dependsOn, item)) {
			throw new Error();
		}

		customAction.action.call(req.list, req, res, function (message) {
			if (!message) {
				message = '"' + customAction.name + '" was successful.';
			}
			if (customAction.save.post) {
				req.item.save(function () {
					res.status(200).json({ message: message });
				});
			} else {
				res.status(200).json({ message: message });
			}
		});
	} catch (e) {
		if (!e.message) {
			e.message = 'There was a problem performing the action "' + customAction.name + '"';
		}
		res.status(500).json({ err: e.message, id: req.params.id, customAction: customAction.slug });
	}
}

function updateItem (item, req, cb) {
	req.list.updateItem(item, {
		data: req.body,
		files: req.files,
	}, function (err) {
		if (err) return res.status(500).json({ err: 'database error', detail: err });
		cb(item);
	});
}

module.exports = function (req, res) {
	var customAction = _.findWhere(req.list._customActions, { slug: req.params.customAction });
	if (!customAction) return res.status(404).json({ err: 'not found', customAction: req.params.customAction });

	req.list.model.findById(req.params.id, function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });

		if (customAction.save.pre) {
			updateItem(item, req, function (item) {
				fireAction(item, customAction, req, res);
			});
		} else {
			fireAction(item, customAction, req, res);
		}

	});
};
