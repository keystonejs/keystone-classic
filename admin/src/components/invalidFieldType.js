/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
	
	render: function() {
		return <div className="alert alert-danger">Invalid field type <strong>{this.props.type}</strong> at path <strong>{this.props.path}</strong></div>;
	}
	
});
