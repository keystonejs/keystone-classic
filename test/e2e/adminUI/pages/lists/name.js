var NameType = require('../fieldTypes/name');
var TextType = require('../fieldTypes/text');

module.exports = function NameList() {
	return {
		selector: '.Form',
		sections: {
			name: new TextType('name'),
			fieldA: new NameType('fieldA'),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
			verifyUI: function() {
				this.expect.section('@name').to.be.visible;
				this.expect.section('@fieldA').to.be.visible;
			}
		}],
	};
};
