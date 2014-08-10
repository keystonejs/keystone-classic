/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
	
	render: function() {
		
		return this.props.note ? 
			<div className="field-note">{this.props.note}</div> :
			null;
		
	}
	
});
