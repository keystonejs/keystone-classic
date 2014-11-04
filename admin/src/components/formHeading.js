var React = require('react');

module.exports = React.createClass({
	
	/**
	 * TODO:
	 * dependsOn
	 */
	
	render: function() {
		return <h3 className="form-heading">{this.props.content}</h3>;
	}
	
});
