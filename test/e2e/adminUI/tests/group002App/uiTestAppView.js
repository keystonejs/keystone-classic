module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();

		browser.adminUIApp.gotoSigninScreen();
		browser.adminUISigninScreen.signin();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'AdminUI app should have a home view': function (browser) {
		browser.adminUIApp.assertElementIsVisible({ element: '@homeScreen' });
	},
	'AdminUI app should have a home icon': function (browser) {
		browser.adminUIApp.assertElementIsVisible({ element: '@homeIcon' });
	},
	'AdminUI app should have a home icon link': function (browser) {
		browser.adminUIApp.assertElementHasAttribute({ element: '@homeIconLink', attribute: 'title', value: 'Dashboard - e2e' });
	},
	'AdminUI app should have a Front Page Icon': function (browser) {
		browser.adminUIApp.assertElementIsVisible({ element: '@frontPageIcon' });
	},
	'AdminUI app should have a Front Page link': function (browser) {
		browser.adminUIApp.assertElementHasAttribute({ element: '@frontPageIconLink', attribute: 'title', value: 'Front page - e2e' });
	},
	'AdminUI app should have a Logout icon': function (browser) {
		browser.adminUIApp.assertElementIsVisible({ element: '@logoutIcon' });
	},
	'AdminUI app should have a Logout link': function (browser) {
		browser.adminUIApp.assertElementHasAttribute({ element: '@logoutIconLink', attribute: 'title', value: 'Sign Out' });
	},
	'AdminUI app should have an Access section in the primary navbar': function (browser) {
		browser.adminUIApp.assertPrimaryNavbarSectionVisible({ section: 'Access' });
	},
	'AdminUI app should have an Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.assertPrimaryNavbarSectionVisible({ section: 'Fields' });
	},
	'AdminUI app should have an Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.assertPrimaryNavbarSectionVisible({ section: 'Miscs' });
	},
	'AdminUI app should have a Users list in the secondary navbar under the Access section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Access' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'User' });
	},
	'AdminUI app should have a Boolean list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Boolean' });
	},
	'AdminUI app should have a CloudinaryImage list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'CloudinaryImage' });
	},
	'AdminUI app should have a CloudinaryImageMultiple list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'CloudinaryImageMultiple' });
	},
	'AdminUI app should have a Code list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Code' });
	},
	'AdminUI app should have a Color list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Color' });
	},
	'AdminUI app should have a Date list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Date' });
	},
	'AdminUI app should have a DateArray list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'DateArray' });
	},
	'AdminUI app should have a Datetime list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Datetime' });
	},
	'AdminUI app should have a Email list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Email' });
	},
	'AdminUI app should have a File list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'File' });
	},
	'AdminUI app should have a GeoPoint list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'GeoPoint' });
	},
	'AdminUI app should have a Html list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Html' });
	},
	'AdminUI app should have a Key list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Key' });
	},
	'AdminUI app should have a Location list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Location' });
	},
	'AdminUI app should have a Markdown list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Markdown' });
	},
	'AdminUI app should have a Money list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Money' });
	},
	'AdminUI app should have a Name list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Name' });
	},
	'AdminUI app should have a Number list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Number' });
	},
	'AdminUI app should have a NumberArray list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'NumberArray' });
	},
	'AdminUI app should have a Password list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Password' });
	},
	'AdminUI app should have a Relationship list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Relationship' });
	},
	'AdminUI app should have a Select list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Select' });
	},
	'AdminUI app should have a Text list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Text' });
	},
	'AdminUI app should have a Textarea list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Textarea' });
	},
	'AdminUI app should have a TextArray list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'TextArray' });
	},
	'AdminUI app should have a Url list in the secondary navbar under the Fields section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Fields' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'Url' });
	},
	'AdminUI app should have a DateFieldMap list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'DateFieldMap' });
	},
	'AdminUI app should have a DependsOn list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'DependsOn' });
	},
	'AdminUI app should have a HiddenRelationship list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'HiddenRelationship' });
	},
	'AdminUI app should have a InlineRelationship list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'InlineRelationship' });
	},
	'AdminUI app should have a ManyRelationship list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'ManyRelationship' });
	},
	'AdminUI app should have a NoDefaultColumn list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'NoDefaultColumn' });
	},
	'AdminUI app should have a SourceRelationship list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'SourceRelationship' });
	},
	'AdminUI app should have a TargetRelationship list in the secondary navbar under the Miscs section in the primary navbar': function (browser) {
		browser.adminUIApp.clickPrimaryNavbar({ section: 'Miscs' });
		browser.adminUIApp.assertSecondaryNavbarListVisible({ list: 'TargetRelationship' });
	},
};
