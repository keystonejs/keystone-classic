var TextType = require('../fieldTypes/text');
var UrlType = require('../fieldTypes/url');

module.exports = function UrlList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new UrlType({fieldName: 'fieldA'}),
			fieldB: new UrlType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
