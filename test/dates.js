if (module.parent) return;

/**
	These tests are currently designed to be run from the command line like
	`/keystone/tests node dates`
	
	Currently in this format for expermientation with what moment does with
	different input, shouldn't be turned into unit tests for Keystone.
*/

var moment = require('moment'),
	_dashes_ = '------------------------------';

console.log('\n==============================');
console.log('Running Tests:');
console.log('==============================\n');

console.log(_dashes_);
console.log('Parsing Input:')
console.log(_dashes_);

var parseFormats = ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'];

var parse = function(input) {
	var m = moment(input, parseFormats);
	var tabs = (input.length < 16) ? '\t\t' : '\t';
	console.log(input + tabs + '--> ' + (m ? m.format('YYYY-MM-DD HH:mm:ss') : 'null'));
}

parse('2013-09-09 1:00 am');
parse('2013-09-09 2:00 pm');
parse('2013-09-09 1:00');
parse('2013-09-09 1:2');
parse('2013-09-09 13:00');
parse('2013-09-09 21:00:03');
parse('2013-09-09 1:02:03');
parse('2013-09-09 1:02:03 p');
parse('2013-09-09 1:2:3 PM');

