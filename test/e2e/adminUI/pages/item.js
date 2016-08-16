var BooleanList = require('./lists/boolean');
var CloudinaryImageList = require('./lists/cloudinaryImage');
var CloudinaryImageMultipleList = require('./lists/cloudinaryImageMultiple');
var CodeList = require('./lists/code');
var ColorList = require('./lists/color');
var DateArrayList = require('./lists/dateArray');
var DateList = require('./lists/date');
var DatetimeList = require('./lists/datetime');
var FileList = require('./lists/file');
var GeoPointList = require('./lists/geoPoint');
var EmailList = require('./lists/email');
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
			selector: '.keystone-body',
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
				emailList: new EmailList(),
				fileList: new FileList(),
				geopointList: new GeoPointList(),
				htmlList: new HtmlList(),
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
		listBreadcrumb: 'a[data-e2e-editform-header-back]',
		searchInputIcon: '.EditForm__header__search input[class="FormInput EditForm__header__search-input"]',
		newItemButton: 'button[data-e2e-item-create-button]',

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
				var task = form.section[list].section[field].assertUIVisible(config.args);
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
		assertUINotNotPresent: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].assertUINotPresent(config.args);
				tasks.push(task);
			});
			return tasks;
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
		back: function() {
			return this
				.click('@listBreadcrumb');
		},
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
		assertFlashMessage: function (message) {
			return this.expect.element('@flashMessage')
				.text.to.equal(message);
		},
		assertFlashError: function (message) {
			return this.expect.element('@flashError')
				.text.to.equal(message);
		},
		navitageToFirstRelationship: function() {
			return this
				.click('@firstRelationshipItemLink');
		},
	}],
};
