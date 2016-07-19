/*
	Tidier binding for component methods to Classes
	===============================================

	constructor() {
		super();
		bindFunctions.call(this, ['handleClick', 'handleOther']);
	}
*/
module.exports = function bindFunctions (functions) {
	functions.forEach(f => (this[f] = this[f].bind(this)));
};
