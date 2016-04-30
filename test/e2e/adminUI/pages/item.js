var CodeList = require('./lists/code');
var ColorList = require('./lists/color');
var DateList = require('./lists/date');
var DatetimeList = require('./lists/datetime');
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
	}],
};
