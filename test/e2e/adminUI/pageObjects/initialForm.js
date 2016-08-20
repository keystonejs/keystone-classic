module.exports = {
	sections: {
		form: {
			selector: '.Modal-dialog .create-form',
			sections: {},
			elements: {
				//
				// FORM LEVEL ELEMENTS
				//
				createButton: 'button[class="Button Button--success"]',
				cancelButton: 'button[class="Button Button--link-cancel"]',
			},
			commands: [{}],
		},
	},
	elements: {
		//
		// PAGE LEVEL ELEMENTS
		//
		flashError: '.Alert--danger'
	},
	commands: [{
		//
		// PAGE LEVEL COMMANDS
		//
		assertFlashError: function (message) {
			return this.expect.element('@flashError')
				.text.to.equal(message);
		},
		assertUIVisible: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.listModelTestConfig();
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('assertUIVisible')) {
					form.section['list'][field].commands.assertUIVisible(browser, config.args);
				} else {
					console.log('Not calling assertUIVisible() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		assertUINotVisible: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.listModelTestConfig();
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('assertUINotVisible')) {
					form.section['list'][field].commands.assertUINotVisible(browser, config.args);
				} else {
					console.log('Not calling assertUINotVisible() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		assertUIPresent: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.listModelTestConfig();
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('assertUIPresent')) {
					form.section['list'][field].commands.assertUIPresent(browser, config.args);
				} else {
					console.log('Not calling assertUIPresent() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		assertUINotPresent: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.listModelTestConfig();
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('assertUINotPresent')) {
					form.section['list'][field].commands.assertUINotPresent(browser, config.args);
				} else {
					console.log('Not calling assertUINotPresent() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		showMoreFields: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.listModelTestConfig();
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('showMoreFields')) {
					form.section['list'][field].commands.showMoreFields(browser, config.args);
				} else {
					console.log('Not calling showMoreFields() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		fillInputs: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.listModelTestConfig();
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('fillInput')) {
					fieldTestObject.commands.fillInput(browser, config.fields[field]);
				} else {
					console.log('Not calling fillInput() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		assertInputs: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.listModelTestConfig();
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('assertInput')) {
					fieldTestObject.commands.assertInput(browser, config.fields[field]);
				} else {
					console.log('Not calling assertInput() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		save: function () {
			return this.section.form
				.click('@createButton');
		},
		cancel: function (config) {
			return this.section.form
				.click('@cancelButton');
		},
	}],
};
