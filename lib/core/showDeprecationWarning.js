module.exports = function showDeprecationWarning (deprecationName, warningMessage) {
	if (this.__deprecationsWarned[deprecationName]) return;
	this.__deprecationsWarned[deprecationName] = true;
	console.warn(warningMessage);
};
