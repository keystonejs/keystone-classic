var CodeList = require('./lists/code');
var ColorList = require('./lists/color');
var DateList = require('./lists/date');
var DatetimeList = require('./lists/datetime');
var HtmlList = require('./lists/html');
var MarkdownList = require('./lists/markdown');
var NameList = require('./lists/name');
var PasswordList = require('./lists/password');
var SelectList = require('./lists/select');
var TextList = require('./lists/text');
var TextareaList = require('./lists/textarea');
var UrlList = require('./lists/url');
var UserList = require('./lists/user');

module.exports = {
	sections: {
		form: {
			selector: '.keystone-body',
			sections: {
				//
				// DEFINE ALL LISTS
				//
				codeList: new CodeList(),
				colorList: new ColorList(),
				dateList: new DateList(),
				datetimeList: new DatetimeList(),
				htmlList: new HtmlList(),
				markdownList: new MarkdownList(),
				nameList: new NameList(),
				passwordList: new PasswordList(),
				selectList: new SelectList(),
				textList: new TextList(),
				textareaList: new TextareaList(),
				urlList: new UrlList(),
				userList: new UserList(),
			},
			elements: {
				//
				// FORM LEVEL ELEMENTS
				//
				saveButton: 'button[class="Button Button--primary"]',
				resetButton: 'button[class="Button Button--link-cancel"]',
				deleteButton: 'button[class="Button Button--link-delete u-float-right"]',
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
		listBreadcrumb: '.EditForm__header__back',
		searchInputIcon: '.EditForm__header__search input[class="FormInput EditForm__header__search-input"]',
		newItemButton: '.Toolbar__section button[class="Button Button--success"]',

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
		saveButton: '.EditForm-container button[class="Button Button--primary"]',
		resetButton: '.EditForm-container button[class="Button Button--link-cancel"]',
		resetButtonText: '.EditForm-container button[class="Button Button--link-cancel"] span',
		deleteButton: '.EditForm-container button[class="Button Button--link-delete u-float-right"]',
		deleteButtonText: '.EditForm-container button[class="Button Button--link-delete u-float-right"] span',
	},
	commands: [{
		//
		// PAGE LEVEL COMMANDS
		//
		new: function() {
			return this
				.click('@newItemButton');
		},
		save: function() {
			return this.section.form
				.click('@saveButton');
		},
		reset: function() {
			return this.section.form
				.click('@resetButton');
		},
		delete: function() {
			return this.section.form
				.click('@deleteButton');
		},
		fillInputs: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			var fields = Object.keys(config.fields);
			fields.forEach( function(field) {
				var task = form.section[list].section[field]
					.fillInput(config.fields[field]);
				tasks.push(task);
			});
			return tasks;
		},
		assertInputs: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			var fields = Object.keys(config.fields);
			fields.forEach( function(field) {
				var task = form.section[list].section[field]
					.assertInput(config.fields[field]);
				tasks.push(task);
			});
			return tasks;
		},
		assertFlashMessage: function (message) {
			return this.expect.element('@flashMessage')
				.text.to.equal(message);
		},
		assertFlashError: function (message) {
			return this.expect.element('@flashError')
				.text.to.equal(message);
		},
	}],
};
