var nameList = require('./lists/name');

module.exports = {
	sections: {
		form: {
			selector: '.Modal-dialog',
			sections: nameList,
		},
	},
	elements: {
		createButton: '.Modal__footer > button:nth-child(1)',
	},
	commands: [{
		fillNameListForm: function(list, suffix) {
			list.section.nameField
				.setValue('@value', 'Name Field Test ' + suffix);

			list.section.fieldA
				.setValue('@firstName', 'First ' + suffix)
				.setValue('@lastName', 'Last ' + suffix);

			return this
				.click('@createButton');
		},
	}],
};
