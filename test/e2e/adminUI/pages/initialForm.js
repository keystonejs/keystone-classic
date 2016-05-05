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
			selector: '.Modal-dialog',
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
		assertUI: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].verifyUI();
				tasks.push(task);
			});
			return tasks;
		},
		cancel: function (config) {
			return this.section.form
				.click('@cancelButton');
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
		save: function() {
			return this.section.form
				.click('@createButton');
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
	}],
};
