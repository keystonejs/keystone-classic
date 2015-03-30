var _ = require('underscore'),
	Field = require('../Field'),
	ArrayFieldMixin = require('../../mixins/DateArrayField');

module.exports = Field.create({
	
	displayName: 'DateArrayField',
	
	mixins: [ArrayFieldMixin]
	
});
