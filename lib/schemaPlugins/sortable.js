module.exports = function sortable () {

	var list = this;

	this.add({
		sortOrder: { type: Number, index: true, hidden: true },
	});

	this.schema.pre('save', function (next) {

		if (typeof this.sortOrder === 'number') {
			return next();
		}

		var item = this;

		var addLast = function (done) {
			list.model.findOne().sort('-sortOrder').exec(function (err, max) { // eslint-disable-line no-unused-vars, handle-callback-err
				item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 1;
				done();
			});
		};

		if (list.get('sortable') === 'unshift') {
			list.model.where('sortOrder')
				.setOptions({ multi: true })
				.update(
					{ $inc: { sortOrder: 1 } },
					function (err) {
						if (err) {
							console.log('err', err);
							return addLast(next);
						}
						item.sortOrder = 1;
						next();
					}
				);
		} else {
			addLast(next);
		}
	});

	this.schema.statics.reorderItems = function reorderItems (id, prevOrder, newOrder, cb) {

		prevOrder = parseFloat(prevOrder);
		newOrder = parseFloat(newOrder);

		var whichWay = (newOrder > prevOrder) ? -1 : 1;
		// var gte = (newOrder > prevOrder) ? prevOrder + 1 : newOrder;
		// var lte = (newOrder > prevOrder) ? newOrder : prevOrder - 1;

		// console.log('this.schema.statics.reorderItems whichWay - '+whichWay);
		// console.log('this.schema.statics.reorderItems id - '+id);
		// console.log('this.schema.statics.reorderItems prevOrder - '+prevOrder);
		// console.log('this.schema.statics.reorderItems newOrder - '+newOrder);

		var beforeIdx = 1;
		var afterIdx = +newOrder + 1;

		list.model.find().sort('sortOrder').exec(function (err, myList) {

			myList.forEach(function (item, idx) {

				if (String(item._id) === String(id)) {
					// console.log('THE ONE: '+item.name+" - "+newOrder)
					list.model.findOneAndUpdate({ _id: item.id }, { sortOrder: newOrder }).exec()
				} else {

					if (idx + 1 === newOrder) {
						console.log('WHICH WAY - '+whichWay)
						if (whichWay === 1) {
							// console.log('WHICH AFTER: '+item.name+" - "+afterIdx)
							list.model.findOneAndUpdate({ _id: item.id }, { sortOrder: afterIdx }).exec()
							afterIdx++;
						} else {
							// console.log('WHICH BEFORE: '+item.name+" - "+beforeIdx)
							list.model.findOneAndUpdate({ _id: item.id }, { sortOrder: beforeIdx }).exec()
							beforeIdx++;
						}

					} else {

						if (idx < newOrder) {
							// console.log('BEFORE: '+item.name+" - "+beforeIdx)
							list.model.findOneAndUpdate({ _id: item.id }, { sortOrder: beforeIdx }).exec()
							beforeIdx++;
						} else {
							// console.log('AFTER: '+item.name+" - "+afterIdx)
							list.model.findOneAndUpdate({ _id: item.id }, { sortOrder: afterIdx }).exec()

						}
					}
				}

				// if (idx == myList.length-1) {
				// 	console.log('DONE')
				// 	return 'ok'
				// }

			});

		});


		// return list.model
		// 	.where('sortOrder')
		// 	.gte(gte)
		// 	.lte(lte)
		// 	.setOptions({ multi: true })
		// 	.update({ $inc: { sortOrder: whichWay } }, function (err) {
		// 		if (err) {
		// 			console.log('err', err);
		// 		}
		// 		list.model.findOneAndUpdate({ _id: id }, { sortOrder: newOrder }).exec(cb);
		// 	});
	};



};
