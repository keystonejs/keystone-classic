/** @jsx React.DOM */

var React = require('react'),
	Field = require('../field');

module.exports = Field.create({
	
	type: 'text',
	
	supports: {
		width: true
	}
	
});
