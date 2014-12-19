var _ = require('underscore'),
	Field = require('../field'),
	ArrayFieldMixin = require('../../mixins/arrayfield');

module.exports = Field.create({
	mixins: [ArrayFieldMixin]
});
