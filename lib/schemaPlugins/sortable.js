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
		list.model.findOne().sort('-sortOrder').exec(function(err, max) {// eslint-disable-line no-unused-vars, handle-callback-err
			item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 1;
			next();
		});

	});

};
