function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
};

module.exports = function evalDependsOn(dependsOn, values) {
	if (!isObject(dependsOn)) return true;
	var keys = Object.keys(dependsOn);
	return (keys.length) ? keys.every(function(key) {
		var dependsValue = dependsOn[key];
		if (typeof dependsValue === 'boolean') {
			if (typeof values[key] === 'boolean') {
				return dependsValue === values[key];
			} else {
				return dependsValue !== (Object.keys(values[key]).length === 0);
			}
		}
		var matches = Array.isArray(dependsValue) ? dependsValue : [dependsValue];
		return matches.indexOf(values[key]) !== -1;
	}) : true;
};
