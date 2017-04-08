module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	req.list.model.findById(req.params.id, function (err, item) {
		if (err) return res.status(500).json({ error: 'database error', detail: err });
		if (!item) return res.status(404).json({ error: 'not found', id: req.params.id });

		function returnItem (err, itemId) {
			if (err) {
				var status = err.error === 'validation errors' ? 400 : 500;
				var error = err.error === 'database error' ? err.detail : err;
				return res.apiError(status, error);
			}
			// Reload the item from the database to prevent save hooks or other
			// application specific logic from messing with the values in the item
			req.list.model.findById(itemId || req.params.id, function (err, updatedItem) {
				res.json(req.list.getData(updatedItem));
			});
		}

		// CASE: Edititng FROM A DRAFT - done
		// EDITING FROM THE ORIGINAL ITEM
		if (item.isDraftable && req.user.role.key === 'contributor' && !item.isDraft) {
			return req.list.model.findOne({
				isDraft: true,
				originalItem: req.params.id,
			})
			.then(draftItem => {
				if (!draftItem) {
					draftItem = new req.list.model();
				}

				Object.assign(req.body, {
					isDraft: true,
					originalItem: req.params.id,
				});

				req.list.updateItem(draftItem, req.body, {
					files: req.files,
					ignoreNoEdit: true,
					user: req.user,
				}, function () {
					const data = {
						hasDraft: true,
						draftItem: draftItem.id,
					};

					const options = {
						ignoreNoEdit: true,
					};

					req.list.updateItem(item, data, options, returnItem);
				});
			});
		}

		// If this is a draft && user is not contributor
		// Find original item, or create it, update it
		// Remove this item
		if (item.isDraft && req.user.role.key !== 'contributor') {
			return req.list
				.model
				.findById(item.originalItem)
				.then(originalItem => {
					// Create new item if original doesn't exist
					if (!originalItem) {
						originalItem = new req.list.model();
					}

					req.list.updateItem(originalItem, req.body, {
						files: req.files,
						user: req.user,
					}, function () {
						item.remove(error => {
							if (error) console.log(error);

							// NOTE: This doesn't result in redirect
							// Passing the ID just doesn't break it
							returnItem(undefined, originalItem.id);
						});
					});
				});
		}

		// If this is not a draft update this item (original)
		// remove draft anyway
		const draftItemId = item.draftItem;
		const body = Object.assign({}, req.body, {
			hasDraft: false,
			draftItem: null,
		});

		return req.list.updateItem(item, body, {
			files: req.files,
			ignoreNoEdit: true,
			user: req.user,
		}, function () {
			if (draftItemId) {
				req.list
					.model
					.findById(draftItemId)
					.then(draftItem => draftItem.remove(returnItem));
			} else {
				returnItem();
			}
		});
	});
};
