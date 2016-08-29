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
		assertFieldUIVisible: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertFieldUIVisible')) {
					form.section['list'][field.name].commands.assertFieldUIVisible(browser, field.options);
				} else {
					console.log('***Initial form not calling assertFieldUIVisible() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		assertFieldUINotVisible: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertFieldUINotVisible')) {
					form.section['list'][field.name].commands.assertFieldUINotVisible(browser, field.options);
				} else {
					console.log('***Initial form not calling assertFieldUINotVisible() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		assertFieldUIPresent: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertFieldUIPresent')) {
					form.section['list'][field.name].commands.assertFieldUIPresent(browser, field.options);
				} else {
					console.log('***Initial form not calling assertFieldUIPresent() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		assertFieldUINotPresent: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertFieldUINotPresent')) {
					form.section['list'][field.name].commands.assertFieldUINotPresent(browser, field.options);
				} else {
					console.log('***Initial form not calling assertFieldUINotPresent() in ' + field.name + ' field test object -- function not defined');
				}
			});
		},
		clickFieldUI: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('clickFieldUI')) {
					if (config.fields[field].hasOwnProperty('click')) {
						fieldTestObject.commands.clickFieldUI(browser, config.fields[field]['click']);
					} else {
						console.log('***Initial form not calling clickFieldUI() in ' + field + ' field test object -- field missing click configuration in test');
					}
				} else {
					console.log('***Initial form not calling clickFieldUI() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		fillFieldInputs: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('fillFieldInputs')) {
					fieldTestObject.commands.fillFieldInputs(browser, config.fields[field]);
				} else {
					console.log('***Initial form not calling fillFieldInputs() in ' + field + ' field test object -- function not defined');
				}
			});
		},
		assertFieldInputs: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return Object.keys(config.fields).forEach(function (field) {
				var fieldTestObject = form.section['list'][field];
				if (fieldTestObject.commands.hasOwnProperty('assertFieldInputs')) {
					fieldTestObject.commands.assertFieldInputs(browser, config.fields[field]);
				} else {
					console.log('***Initial form not calling assertFieldInputs() in ' + field + ' field test object -- function not defined');
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
