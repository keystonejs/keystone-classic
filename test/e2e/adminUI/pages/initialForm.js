var CodeList = require('./lists/code');
var DateList = require('./lists/date');
var NameList = require('./lists/name');
var SelectList = require('./lists/select');
var TextList = require('./lists/text');
var TextareaList = require('./lists/textarea');
var UrlList = require('./lists/url');

module.exports = {
	sections: {
		form: {
			selector: '.Modal-dialog',
			sections: {
				//
				// DEFINE ALL LISTS
				//
				codeList: new CodeList(),
				dateList: new DateList(),
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
	},
	commands: [{
		//
		// PAGE LEVEL COMMANDS
		//
	}],
};
