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
		metaHeader: '.EditForm h3[class="form-heading"]',
		metaCreatedAtLabel: '.EditForm .FormField[for="createdAt"] label[for="createdAt"]',
		metaCreatedAtValue: '.EditForm .FormField[for="createdAt"] .FormInput-noedit',
		metaCreatedByLabel: '.EditForm .FormField[for="createdBy"] label[for="createdBy"]',
		metaCreatedByValue: '.EditForm .FormField[for="createdBy"] .FormInput-noedit',
		metaUpdatedAtLabel: '.EditForm .FormField[for="updatedAt"] label[for="updatedAt"]',
		metaUpdatedAtValue: '.EditForm .FormField[for="updatedAt"] .FormInput-noedit',
		metaUpdatedByLabel: '.EditForm .FormField[for="updatedBy"] label[for="updatedBy"]',
		metaUpdatedByValue: '.EditForm .FormField[for="updatedBy"] .FormInput-noedit',
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
		assertFieldUIVisible: function (config) {
			var form = this.section.form;
			form.section['list'] = new config.modelTestConfig({formSelector: form.selector});
			var browser = this;
			return config.fields.forEach(function (field) {
				var fieldTestObject = form.section['list'][field.name];
				if (fieldTestObject.commands.hasOwnProperty('assertFieldUIVisible')) {
					form.section['list'][field.name].commands.assertFieldUIVisible(browser, field.options);
				} else {
					console.log('***Item form not calling assertFieldUIVisible() in ' + field.name + ' field test object -- function not defined');
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
					console.log('***Item form not calling assertFieldUINotVisible() in ' + field.name + ' field test object -- function not defined');
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
					console.log('***Item form not calling assertFieldUIPresent() in ' + field.name + ' field test object -- function not defined');
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
					console.log('***Item form not calling assertFieldUINotPresent() in ' + field.name + ' field test object -- function not defined');
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
						console.log('***Item form not calling clickFieldUI() in ' + field + ' field test object -- field missing click configuration in test');
					}
				} else {
					console.log('***Item form not calling clickFieldUI() in ' + field + ' field test object -- function not defined');
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
					console.log('***Item form not calling fillFieldInputs() in ' + field + ' field test object -- function not defined');
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
					console.log('***Item form not calling assertFieldInputs() in ' + field + ' field test object -- function not defined');
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
