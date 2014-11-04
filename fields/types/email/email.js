/** @jsx React.DOM */
	
/*
	TODO:
	- gravatar
	- validate email address
 */

var React = require('react'),
	Field = require('../field');

module.exports = Field.create({
	
	supports: {
		width: true
	},
	
	renderValue: function() {
		return this.props.value
			? <a className="ui-related-item" href={"mailto:" + this.props.value}>{this.props.value}</a>
			: <div className="help-block">(not set)</div>;
	}
	
});
