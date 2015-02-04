var React = require('react');

function evalDependsOn(dependsOn, values) {
	if (!_.isObject(dependsOn)) return true;
	var keys = _.keys(dependsOn);
	return (keys.length) ? _.every(keys, function(key) {
		var matches = _.isArray(dependsOn[key]) ? dependsOn[key] : [dependsOn[key]];
		return _.contains(matches, values[key]);
	}, this) : true;
}

module.exports = React.createClass({
	
	displayName: 'FormHeading',
	
	render: function() {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		return <h3 className="form-heading">{this.props.content}</h3>;
	}
	
});
