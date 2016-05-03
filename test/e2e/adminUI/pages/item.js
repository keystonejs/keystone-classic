var CodeList = require('./lists/code');
var ColorList = require('./lists/color');
var DateList = require('./lists/date');
var DatetimeList = require('./lists/datetime');
var HtmlList = require('./lists/html');
var NameList = require('./lists/name');
var SelectList = require('./lists/select');
var TextList = require('./lists/text');
var TextareaList = require('./lists/textarea');
var UrlList = require('./lists/url');

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
				nameList: new NameList(),
				selectList: new SelectList(),
				textList: new TextList(),
				textareaList: new TextareaList(),
				urlList: new UrlList(),
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
		listBreadcrumb: 'a.Button',
		flashMessage: '.Alert > span:nth-child(1)',
	},
	commands: [{
		//
		// PAGE LEVEL COMMANDS
		//
		assertFlashMessage: function (message) {
			return this.expect.element('@flashMessage')
			.text.to.equal(message);
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
				.click('@saveButton');
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
