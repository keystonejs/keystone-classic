module.exports = function sortable() {

	var list = this;

	this.add({
		sortOrder: { type: Number, index: true }
	});

	this.schema.pre('save', function(next) {

		if (typeof this.sortOrder === 'number') {
			return next();
		}

		var item = this;
		list.model.findOne().sort('-sortOrder').exec(function(err, max) {// eslint-disable-line no-unused-vars, handle-callback-err
			item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 1;
			next();
		});

	});
	
	this.schema.statics.reorderItems = function reorderItems(id, prevOrder, newOrder, cb) {
		
		var newOrder = parseFloat(newOrder);
		var prevOrder = parseFloat(prevOrder);
		
		var whichWay = (newOrder > prevOrder) ? -1 : 1;
		var gte = (newOrder > prevOrder) ? prevOrder + 1 : newOrder;
		var lte = (newOrder > prevOrder) ? newOrder : prevOrder - 1;
		return list.model
			.where('sortOrder')
			.gte(gte)
			.lte(lte)
			.setOptions({ multi: true })
			.update({ $inc: { 'sortOrder': whichWay } }, function(err) {
				if(err) {
					console.log('err', err);
				}
				list.model.findOneAndUpdate({ _id: id }, { sortOrder: newOrder }).exec(cb);
			});		
	};
	
};
