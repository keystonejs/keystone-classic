var utils = require('../lib/utils'),
	_dashes_ = '------------------------------';

console.log(_dashes_);
console.log('Titlecase:')
console.log(_dashes_);

var titlecase = function(str) {
	console.log(str + ' --> ' + utils.titlecase(str));
}

titlecase('one');
titlecase('one two');
titlecase('one Two three');


console.log(_dashes_);
console.log('Key to Label:')
console.log(_dashes_);

var keyToLabel = function(str) {
	console.log(str + ' --> ' + utils.keyToLabel(str));
}

keyToLabel('one');
keyToLabel('oneTwo');
keyToLabel('one_two');
keyToLabel('oneTwoThree');
keyToLabel('one twoThree');
keyToLabel('oneTwo.three');
keyToLabel('oneTwo-threeFour');
keyToLabel('oneTwo:three;four');


