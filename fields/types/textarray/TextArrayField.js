/* eslint-disable no-unused-vars*/ //temporary fix for https://github.com/yannickcr/eslint-plugin-react/issues/50#issuecomment-96708326
var _ = require('underscore'),
	Field = require('../Field'),
	ArrayFieldMixin = require('../../mixins/ArrayField');
/* eslint-enable */

module.exports = Field.create({
	
	displayName: 'TextArrayField',
	
	mixins: [ArrayFieldMixin]
	
});
