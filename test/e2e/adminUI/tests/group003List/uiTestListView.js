var UserModelTestConfig = require('../../../modelTestConfig/UserModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();

		browser.adminUIApp.gotoSigninScreen();

		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();

		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIApp.openList({section: 'access', list: 'users'}).waitForListScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'List screen must show a search bar': function (browser) {
		browser.adminUIListScreen.assertSearchInputFieldVisible();
	},
	'List screen must show a search field clear icon': function (browser) {
		browser.adminUIListScreen.assertSearchInputClearIconVisible();
	},
	'List screen must show a filter input': function (browser) {
		browser.adminUIListScreen.assertFilterDropDownVisible();
	},
	'List screen must show a column input': function (browser) {
		browser.adminUIListScreen.assertColumnSelectionDropdownVisible();
	},
	'List screen must show a download input': function (browser) {
		browser.adminUIListScreen.assertDownloadDropdownVisible();
	},
	// TODO:  For some reason the expand table width input control does not show in saucelabs' Firefox 44...why?
	//		It shows fine with local selenium server and Firefox 44.0.2
	// 'List screen must show an expand table width input': function (browser) {
	// 	browser.adminUIListScreen.assertExpandTableWidthInputVisible();
	// },
	'List screen must show a create list item button': function (browser) {
		browser.adminUIListScreen.assertCreateMoreItemsButtonVisible();
	},
	'List screen must show a page item count': function (browser) {
		browser.adminUIListScreen.assertPageItemCountTextVisible();
	},
	'List screen must show a name column header': function (browser) {
		browser.adminUIListScreen.assertItemListHeaderVisible({ column: 1 });
		browser.adminUIListScreen.assertItemListHeaderContains({ column: 1, value: 'Name' });
	},
	'List screen must show an email column header': function (browser) {
		browser.adminUIListScreen.assertItemListHeaderVisible({ column: 2 });
		browser.adminUIListScreen.assertItemListHeaderContains({ column: 2, value: 'Email' });
	},
	'List screen must show an Is Admin column header': function (browser) {
		browser.adminUIListScreen.assertItemListHeaderVisible({ column: 3 });
		browser.adminUIListScreen.assertItemListHeaderContains({ column: 3, value: 'Is Admin' });
	},
	'List screen items must show a delete icon': function (browser) {
		browser.adminUIListScreen.assertItemDeleteIconVisible([
			{ row: 1, column: 1 },
			{ row: 2, column: 1 },
		]);
	},
	'List screen user item must show a name': function (browser) {
		browser.adminUIListScreen.assertItemFieldUIVisible([
			{ row: 1, column: 2, name: 'name', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 2, name: 'name', modelTestConfig: UserModelTestConfig, },
		]);

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 2, name: 'name', value: 'e2e member', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 2, name: 'name', value: 'e2e user', modelTestConfig: UserModelTestConfig, },
		]);
	},
	'List screen user item must show an email': function (browser) {
		browser.adminUIListScreen.assertItemFieldUIVisible([
			{ row: 1, column: 3, name: 'email', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 3, name: 'email', modelTestConfig: UserModelTestConfig, },
		]);

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 3, name: 'email', value: 'member@test.e2e', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 3, name: 'email', value: 'user@test.e2e', modelTestConfig: UserModelTestConfig, },
		]);
	},
	'List screen user item must have a Is Admin column': function (browser) {
		browser.adminUIListScreen.assertItemFieldUIVisible([
			{ row: 1, column: 4, name: 'isAdmin', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 4, name: 'isAdmin', modelTestConfig: UserModelTestConfig, },
		]);

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 4, name: 'isAdmin', value: 'false', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 4, name: 'isAdmin', value: 'true', modelTestConfig: UserModelTestConfig, },
		]);
	},
	'List screen user item must have a Is Member column': function (browser) {
		browser.adminUIListScreen.assertItemFieldUIVisible([
			{ row: 1, column: 5, name: 'isMember', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 5, name: 'isMember', modelTestConfig: UserModelTestConfig, },
		]);

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 5, name: 'isMember', value: 'true', modelTestConfig: UserModelTestConfig, },
			{ row: 2, column: 5, name: 'isMember', value: 'false', modelTestConfig: UserModelTestConfig, },
		]);
	},
};
