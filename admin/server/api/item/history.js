var keystone = require('../../../../');

module.exports = {
	history: function (req, res) {
		module.exports.getHistory(req.params.id, req.list.model.modelName, function (err, result) {
			if (err) {
				console.error(err);
				return res.send('Error getting history');
			}
			return res.send(result);
		});
	},

	getHistory: function (id, modelName, callback) {
		var list = keystone.list(modelName);
		var historyList = list.options.schema.collection + '_revisions';
		var historyModel = keystone.mongoose.model(historyList);
		historyModel.find({ i: id })
			.sort('-t')
			.populate('u')
			.exec(function (err, results) {
				if (err) {
					console.error(err);
					return callback(err, null);
				}
				return callback(null, results);
			});
	},
};
