function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
};

module.exports = function evalDependsOn(dependsOn, values) {
    if (!isObject(dependsOn) || !Object.keys(dependsOn).length) {
        return true;
    }

    return Object.keys(dependsOn).every(function(key) {
        var value = values[key];
        var dependsOnValue = dependsOn[key];

        if (typeof dependsOnValue === 'boolean' && typeof value !== 'boolean') {
            value = Boolean(Object.keys(value).length);
        }

        if (Array.isArray(dependsOnValue)) {
            return dependsOnValue.indexOf(value) !== -1;
        }

        return dependsOnValue === value;
    });
};
