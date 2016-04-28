var CodeList = require('./lists/code');
var NameList = require('./lists/name');
var TextList = require('./lists/text');

module.exports = {
	sections: {
		form: {
			selector: '.Modal-dialog',
			sections: {
				//
				// DEFINE ALL LISTS
				//
				codeList: new CodeList(),
				nameList: new NameList(),
				textList: new TextList(),
			},
			elements: {
				//
				// FORM LEVEL ELEMENTS
				//
				createButton: 'button[class="Button Button--success"]',
				cancelButton: 'button[class="Button Button--link-cancel"]',
			},
			commands: [{
				//
				// FORM LEVEL COMMANDS
				//
			}],
		},
	},
	elements: {
		//
		// PAGE LEVEL ELEMENTS
		//
	},
	commands: [{
		//
		// PAGE LEVEL COMMANDS
		//
	}],
};
