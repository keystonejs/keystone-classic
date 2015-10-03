module.exports = function evalDependsOn(dependsOn, values) {
	if (!_.isObject(dependsOn)) return true;
	var keys = _.keys(dependsOn);
	return (keys.length) ? _.every(keys, function(key) {
		var dependsValue = dependsOn[key];
		if (_.isBoolean(dependsValue)) {
			if (_.isBoolean(values[key])) {
				return dependsValue === values[key];
			} else {
				return dependsValue !== _.isEmpty(values[key]);
			}
		}
		var matches = _.isArray(dependsValue) ? dependsValue : [dependsValue];
		return _.contains(matches, values[key]);
	}, this) : true;
};
