var evalDependsOn = require('../../../fields/utils/evalDependsOn.js');
var React = require('react');

module.exports = React.createClass({
	
	displayName: 'FormHeading',
	
	render: function() {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		return <h3 className="form-heading">{this.props.content}</h3>;
	}
	
});
