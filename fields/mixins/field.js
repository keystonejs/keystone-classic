var _ = require('underscore');

module.exports = {
	
	validateDependsOn: function() {
		if (!_.isObject(this.props.dependsOn)) return true;
		var keys = _.keys(this.props.dependsOn);
		return (keys.length) ? _.every(keys, function(key) {
			return (this.props.values[key] == this.props.dependsOn[key]);
		}, this) : false;
	}
	
}
