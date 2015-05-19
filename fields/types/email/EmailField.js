/*
	TODO:
	- gravatar
	- validate email address
 */

var React = require('react');
var Field = require('../Field');

var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'EmailField',
	
	renderValue: function() {
		return this.props.value ? (
			<FormInput noedit href={'mailto:' + this.props.value}>{this.props.value}</FormInput>
		) : (
			<FormInput noedit>(not set)</FormInput>
		);
	}
	
});
