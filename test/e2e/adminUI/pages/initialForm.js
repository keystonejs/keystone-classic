var NameList = require('./lists/name');

module.exports = {
	sections: {
		form: {
			selector: '.Modal-dialog',
			sections: {
				//
				// DEFINE ALL LISTS
				//
				nameList: new NameList(),
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
