var BooleanList = require('./lists/boolean');
var CloudinaryImageList = require('./lists/cloudinaryImage');
var CloudinaryImageMultipleList = require('./lists/cloudinaryImageMultiple');
var CodeList = require('./lists/code');
var ColorList = require('./lists/color');
var DateArrayList = require('./lists/dateArray');
var DateList = require('./lists/date');
var DatetimeList = require('./lists/datetime');
var EmailList = require('./lists/email');
var FileList = require('./lists/file');
var GeoPointList = require('./lists/geoPoint');
var HtmlList = require('./lists/html');
var KeyList = require('./lists/key');
var LocationList = require('./lists/location');
var MarkdownList = require('./lists/markdown');
var MoneyList = require('./lists/money');
var NameList = require('./lists/name');
var NumberArrayList = require('./lists/numberArray');
var NumberList = require('./lists/number');
var PasswordList = require('./lists/password');
var RelationshipList = require('./lists/relationship');
var SelectList = require('./lists/select');
var TextareaList = require('./lists/textarea');
var TextArrayList = require('./lists/textArray');
var TextList = require('./lists/text');
var UrlList = require('./lists/url');
var UserList = require('./lists/user');
// MISC LISTS:
var DateFieldMapList = require('./lists/misc/dateFieldMap');
var DependsOnList = require('./lists/misc/dependsOn');
var HiddenRelationshipList = require('./lists/misc/hiddenRelationship');
var InlineRelationshipList = require('./lists/misc/inlineRelationship');
var ManyRelationshipList = require('./lists/misc/manyRelationship');
var NoDefaultColumnList = require('./lists/misc/noDefaultColumns');
var SourceRelationshipList = require('./lists/misc/sourceRelationship');
var TargetRelationshipList = require('./lists/misc/targetRelationship');

module.exports = {
	sections: {
		form: {
			selector: '.Modal-dialog',
			sections: {
				//
				// DEFINE ALL LISTS
				//
				booleanList: new BooleanList(),
				cloudinaryimageList: new CloudinaryImageList(),
				cloudinaryimagemultipleList: new CloudinaryImageMultipleList(),
				codeList: new CodeList(),
				colorList: new ColorList(),
				datearrayList: new DateArrayList(),
				dateList: new DateList(),
				datetimeList: new DatetimeList(),
				fileList: new FileList(),
				htmlList: new HtmlList(),
				emailList: new EmailList(),
				geopointList: new GeoPointList(),
				keyList: new KeyList(),
				locationList: new LocationList(),
				markdownList: new MarkdownList(),
				moneyList: new MoneyList(),
				nameList: new NameList(),
				numberarrayList: new NumberArrayList(),
				numberList: new NumberList(),
				passwordList: new PasswordList(),
				relationshipList: new RelationshipList(),
				selectList: new SelectList(),
				textareaList: new TextareaList(),
				textarrayList: new TextArrayList(),
				textList: new TextList(),
				urlList: new UrlList(),
				userList: new UserList(),
				//
				// MISC LISTS
				//
				datefieldmapList: new DateFieldMapList(),
				dependsonList: new DependsOnList(),
				hiddenrelationshipList: new HiddenRelationshipList(),
				inlinerelationshipList: new InlineRelationshipList(),
				manyrelationshipList: new ManyRelationshipList(),
				nodefaultcolumnList: new NoDefaultColumnList(),
				sourcerelationshipList: new SourceRelationshipList(),
				targetrelationshipList: new TargetRelationshipList(),
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
				var task = form.section[list].section[field].assertUI(config.args);
				tasks.push(task);
			});
			return tasks;
		},
		assertUIVisible: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].assertUIVisible(config.args);
				tasks.push(task);
			});
			return tasks;
		},
		assertUINotVisible: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].assertUINotVisible(config.args);
				tasks.push(task);
			});
			return tasks;
		},
		assertUIPresent: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].assertUIPresent(config.args);
				tasks.push(task);
			});
			return tasks;
		},
		assertUINotPresent: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].assertUINotPresent(config.args);
				tasks.push(task);
			});
			return tasks;
		},
		cancel: function (config) {
			return this.section.form
				.click('@cancelButton');
		},
		showMoreFields: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].showMoreFields(config.args);
				tasks.push(task);
			});
			return tasks;
		},
		fillInputs: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			var fields = Object.keys(config.fields);
			fields.forEach( function(field) {
				var task = form.section[list].section[field].fillInput(config.fields[field]);
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
				var task = form.section[list].section[field].assertInput(config.fields[field]);
				tasks.push(task);
			});
			return tasks;
		},
	}],
};
