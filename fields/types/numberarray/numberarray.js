var _ = require('underscore'),
	Field = require('../field'),
	ArrayFieldMixin = require('../../mixins/arrayfield');

module.exports = Field.create({
	
	mixins: [ArrayFieldMixin],
	
	cleanInput: function(input) {
		return input.replace(/[^\d]/g, '');
	}
	
});
