var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to delete ' + req.list.key + ' items; CSRF failure');
		return res.apiError(403, 'invalid csrf');
	}
	if (req.list.get('nodelete')) {
		console.log('Refusing to delete ' + req.list.key + ' items; List.nodelete is true');
		return res.apiError(400, 'nodelete');
	}

	var ids = req.body.ids || req.body.id || req.params.id;
	if (typeof ids === 'string') {
		ids = ids.split(',');
	}
	if (!Array.isArray(ids)) {
		ids = [ids];
	}

	if (req.user) {
		var checkResourceId = (keystone.get('user model') === req.list.key);

		var userId = String(req.user.id);
		// check if user can delete this resources based on resources ids and userId
		if (checkResourceId && ids.some(function (id) {
			return id === userId;
		})) {
			console.log('Refusing to delete ' + req.list.key + ' items; ids contains current User id');
			return res.apiError(403, 'not allowed', 'You can not delete yourself');
		}
	}

	req.list.model.findOne()
		.where('isDraft', false)
		.where('_id').in(ids)
		.then(function (result) {
			const isContributor = req.user && req.user.role.key === 'contributor';

			if (isContributor && result) {
				throw new Error('unauthorized');
			}
		})
		.then(function () {
			var deletedCount = 0;
			var deletedIds = [];
			req.list.model.find().where('_id').in(ids).exec(function (err, results) {
				if (err) {
					console.log('Error deleting ' + req.list.key + ' items:', err);
					return res.apiError('database error', err);
				}
				async.forEachLimit(results, 10, function (item, next) {
					function onItemDelete (err, item) {
						if (err) return next(err);
						deletedCount++;
						deletedIds.push(item.id);
					}

					item.remove(function (err) {
						onItemDelete(err, item);

						let updateOriginal = Promise.resolve();

						if (item.originalItem) {
							updateOriginal.then(() => {
								return req.list
									.model
									.findById(item.originalItem)
									.then(function (result) {
										return new Promise((resolve, reject) => {
											if (!result || !result.draftItem) {
												return resolve();
											}
											const data = {
												draftItem: undefined,
												hasDraft: false,
											};

											const options = {
												ignoreNoEdit: true,
											};

											req.list.updateItem(result, data, options, (error) => {
												if (error) {
													reject(error);
												}

												resolve();
											});
										});
									});
							});
						}

						// If item has draft, delete it too
						if (item.draftItem) {
							updateOriginal.then(() => {
								return req.list
									.model
									.findById(item.draftItem)
									.then(item => {
										return new Promise((resolve, reject) => {
											item.remove(function (err) {
												onItemDelete(err, item);
												if (err) {
													reject(err);
												}

												resolve(item);
											});
										});
									});
							});
						}

						updateOriginal.then(next, next);
					});
				}, function () {
					return res.json({
						success: true,
						ids: deletedIds,
						count: deletedCount,
					});
				});
			});
		}, error => {
			console.log('Refusing to delete ' + req.list.key + ' items; Not authorised to delete');
			return res.apiError(401, error.message, 'As a contributor you can not delete the original item.');
		})
		.catch(error => {
			console.log(error);
			res.apiError(500, error, 'An error occurred. Please try again later.');
		});
};
