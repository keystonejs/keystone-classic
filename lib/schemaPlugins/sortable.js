module.exports = function sortable() {

	var list = this;

	this.schema.add({
		sortOrder: { type: Number, index: true }
	});

	this.schema.pre('save', function(next) {

		if (typeof this.sortOrder === 'number') {
			return next();
		}

		var item = this;
		list.model.findOne().sort('-sortOrder').exec(function(err, max) {
			item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 0;
			next();
		});

	});

};
