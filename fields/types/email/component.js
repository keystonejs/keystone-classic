/** @jsx React.DOM */
	
/*
	TODO:
	- gravatar
	- validate email address
 */

var React = require('react'),
	Field = require('../field');

module.exports = Field.create({
	
	type: 'email',
	
	supports: {
		width: true
	},
	
	renderField: function() {		
		return this.props.noedit ?
			<div className="field-value">{this.props.value}</div> :
			<input type="text" name={this.props.path} value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
});
