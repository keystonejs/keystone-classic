var ExMatch = require('expression-match');

function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
};

module.exports = function evalDependsOn(dependsOn, values) {
    if (!isObject(dependsOn) || !Object.keys(dependsOn).length) {
        return true;
    }
	
	var Match = new ExMatch(dependsOn, values, false);
	return Match.match();
	
};
