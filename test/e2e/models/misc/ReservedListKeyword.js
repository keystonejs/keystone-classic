// THIS MODEL IS USED TO QUICKLY DETECT RESERVED WORDS IN KEYSTONE LISTS
var keystone = require('../../../../index');

var ReservedListKeyword = new keystone.List('ReservedListKeyword', {
	hidden: true,
});

// THE LIST BELOW CORRESPONDS TO THE LIST IN lib/list/isReserved.js
ReservedListKeyword.add({
	//_: { type: String },
	//__defineGetter__: { type: String },
	//__defineSetter__: { type: String },
	//__lookupGetter__: { type: String },
	//__lookupSetter__: { type: String },
	//__proto__: { type: String },
	//_id: { type: String },
	//hasOwnProperty: { type: String },
	//id: { type: String },
	//isPrototypeOf: { type: String },
	//list: { type: String },
	//propertyIsEnumerable: { type: String },
	//prototype: { type: String },
	//toLocaleString: { type: String },
	//toString: { type: String },
	//valueOf: { type: String },
});

ReservedListKeyword.register();

module.exports = ReservedListKeyword;
