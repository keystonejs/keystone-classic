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
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertUIVisible')) {
					form.section['list'][field.name].commands.assertUIVisible(browser, field.options);
				} else {
					console.log('***Initial form not calling assertUIVisible() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		assertUINotVisible: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertUINotVisible')) {
					form.section['list'][field.name].commands.assertUINotVisible(browser, field.options);
				} else {
					console.log('***Initial form not calling assertUINotVisible() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		assertUIPresent: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertUIPresent')) {
					form.section['list'][field.name].commands.assertUIPresent(browser, field.options);
				} else {
					console.log('***Initial form not calling assertUIPresent() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		assertUINotPresent: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertUINotPresent')) {
					form.section['list'][field.name].commands.assertUINotPresent(browser, field.options);
				} else {
					console.log('***Initial form not calling assertUINotPresent() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		clickUI: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('clickUI')) {
					if (config.fields[field].hasOwnProperty('click')) {
						fieldTestObject.commands.clickUI(browser, config.fields[field]['click']);
					} else {
						console.log('***Initial form not calling clickUI() in ' + field + ' field test object -- field missing click configuration in test');
					}
				} else {
					console.log('***Initial form not calling clickUI() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		fillInputs: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('fillInput')) {
					fieldTestObject.commands.fillInput(browser, config.fields[field]);
				} else {
					console.log('***Initial form not calling fillInput() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		assertInputs: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('assertInput')) {
					fieldTestObject.commands.assertInput(browser, config.fields[field]);
				} else {
					console.log('***Initial form not calling assertInput() in ' + field + ' field test object -- function not defined');
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
