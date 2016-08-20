module.exports = {
	sections: {
		form: {
			selector: '.keystone-body .EditForm-container',
			sections: {},
			elements: {
				//
				// FORM LEVEL ELEMENTS
				//
				saveButton: 'button[data-button=update]',
				resetButton: 'button[data-button=reset]',
				deleteButton: 'button[data-button=delete]',
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
		listBreadcrumb: 'a[data-e2e-editform-header-back="true"]',
		searchInputIcon: '.EditForm__header__search input[class="FormInput EditForm__header__search-input"]',
		newItemButton: '.Toolbar__section button[data-e2e-item-create-button="true"]',

		flashMessage: '.Alert--success',
		flashError: '.Alert--danger',

		readOnlyNameHeader: '.EditForm__name-field h2',
		editableNameHeader: '.EditForm__name-field input[class*="item-name-field"',
		idLabel: '.EditForm__key-or-id span[class="EditForm__key-or-id__label"]',
		idValue: '.EditForm__key-or-id span[class="EditForm__key-or-id__field"]',
		metaHeader: '.EditForm__meta h3[class="form-heading"]',
		metaCreatedOnLabel: {
			locateStrategy: 'xpath',
			selector: '//div[contains(@class, "EditForm__meta")]/div[contains(@class, "FormField")][1]/label[contains(@class, "FormLabel")]',
		},
		metaCreatedOnValue: {
			locateStrategy: 'xpath',
			selector: '//div[contains(@class, "EditForm__meta")]/div[contains(@class, "FormField")][1]/div[contains(@class,"FormInput-noedit")]',
		},
		metaCreatedByLabel: {
			locateStrategy: 'xpath',
			selector: '//div[contains(@class, "EditForm__meta")]/div[contains(@class, "FormField")][2]/label[contains(@class, "FormLabel")]',
		},
		metaCreatedByValue: {
			locateStrategy: 'xpath',
			selector: '//div[contains(@class, "EditForm__meta")]/div[contains(@class, "FormField")][2]/div[contains(@class,"FormInput-noedit")]',
		},
		metaUpdatedByLabel: {
			locateStrategy: 'xpath',
			selector: '//div[contains(@class, "EditForm__meta")]/div[contains(@class, "FormField")][3]/label[contains(@class, "FormLabel")]',
		},
		metaUpdatedByValue: {
			locateStrategy: 'xpath',
			selector: '//div[contains(@class, "EditForm__meta")]/div[contains(@class, "FormField")][3]/div[contains(@class,"FormInput-noedit")]',
		},
		saveButton: '.EditForm-container button[data-button=update]',
		resetButton: '.EditForm-container button[data-button=reset]',
		resetButtonText: '.EditForm-container button[data-button=reset] span',
		deleteButton: '.EditForm-container button[data-button=delete]',
		deleteButtonText: '.EditForm-container button[data-button=delete] span',
		firstRelationshipItemLink: 'div.Relationships > div > div > div > table > tbody > tr > td > a',
	},
	commands: [{
		//
		// PAGE LEVEL COMMANDS
		//
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
		assertFlashMessage: function (message) {
			return this.expect.element('@flashMessage')
				.text.to.equal(message);
		},
		assertFlashError: function (message) {
			return this.expect.element('@flashError')
				.text.to.equal(message);
		},
		navitageToFirstRelationship: function () {
			return this
				.click('@firstRelationshipItemLink');
		},
		back: function () {
			return this
				.click('@listBreadcrumb');
		},
		new: function () {
			return this
				.click('@newItemButton');
		},
		save: function () {
			return this.section.form
				.click('@saveButton');
		},
		reset: function () {
			return this.section.form
				.click('@resetButton');
		},
		delete: function () {
			return this.section.form
				.click('@deleteButton');
		},
	}],
};
