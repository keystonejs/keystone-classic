/*
	TODO:
	- gravatar
	- validate email address
 */

var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({
	
	displayName: 'EmailField',
	
	renderValue: function() {
		return this.props.value
			? <a className="ui-related-item" href={'mailto:' + this.props.value}>{this.props.value}</a>
			: <div className="help-block">(not set)</div>;
	}
	
});
