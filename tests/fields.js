/**
	These tests are currently designed to be run from the command line like
	`/keystone/tests node fields`
	
	Currently in this format for expermientation, will be implemented as proper
	unit tests soon!
*/

var keystone = require('../').init(),
	Types = keystone.Field.Types;

/** Test List and Fields */

var Test = keystone.List('Test');

Test.add({
	date: Types.Date,
	datetime: Types.Datetime
});

Test.register();

/** Test Item */

var item = new Test.model();

/** FieldType: Date */

item._.date.parse('20131204', 'YYYYMMDD');
console.log('Should be 4th Dec 2013: ' + item._.date.format());
console.log('Should be 20131204: ' + item._.date.format('YYYYMMDD'));
console.log('Should be a moment object:');
console.log(item._.date.moment());
