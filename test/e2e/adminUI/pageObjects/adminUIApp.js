/*
	This page object describes global admin UI configuration and commands that are or should be
	most likely available in all pages.
 */
var keystone = require('../../../..');

module.exports = {
	url: 'http://' + keystone.get('host') + ':' + keystone.get('port') + '/keystone/',
	pause: 1000,
	elements: {
		// ADMIN UI APP SCREENS
		signinScreen: '#signin-view',
		homeScreen: 'div[data-screen-id="home"]',
		listScreen: 'div[data-screen-id="list"]',
		itemScreen: 'div[data-screen-id="item"]',
		initialFormScreen: '.Modal-dialog',
		deleteConfirmationScreen: '.Modal-dialog',
		resetConfirmationScreen: '.Modal-dialog',

		// APP LEVEL MENU
		homeIcon: '.primary-navbar [data-section-label="octicon-home"]',
		homeIconLink: '.primary-navbar [data-section-label="octicon-home"] a',
		frontPageIcon: '.primary-navbar [data-section-label="octicon-globe"]',
		frontPageIconLink: '.primary-navbar [data-section-label="octicon-globe"] a',
		logoutIcon: '.primary-navbar [data-section-label="octicon-sign-out"]',
		logoutIconLink: '.primary-navbar [data-section-label="octicon-sign-out"] a',

		// LIST NAV MENU
		accessMenu: '.primary-navbar [data-section-label="Access"]',
		fieldListsMenu: '.primary-navbar [data-section-label="Fields"]',
		miscListsMenu: '.primary-navbar [data-section-label="Miscs"]',
		booleanListSubmenu: '.secondary-navbar [data-list-path="booleans"]',
		cloudinaryimageListSubmenu: '.secondary-navbar [data-list-path="cloudinary-images"]',
		cloudinaryimagemultipleListSubmenu: '.secondary-navbar [data-list-path="cloudinary-image-multiples"]',
		codeListSubmenu: '.secondary-navbar [data-list-path="codes"]',
		colorListSubmenu: '.secondary-navbar [data-list-path="colors"]',
		datearrayListSubmenu: '.secondary-navbar [data-list-path="date-arrays"]',
		dateListSubmenu: '.secondary-navbar [data-list-path="dates"]',
		datetimeListSubmenu: '.secondary-navbar [data-list-path="datetimes"]',
		emailListSubmenu: '.secondary-navbar [data-list-path="emails"]',
		fileListSubmenu: '.secondary-navbar [data-list-path="files"]',
		geopointListSubmenu: '.secondary-navbar [data-list-path="geo-points"]',
		htmlListSubmenu: '.secondary-navbar [data-list-path="htmls"]',
		keyListSubmenu: '.secondary-navbar [data-list-path="keys"]',
		locationListSubmenu: '.secondary-navbar [data-list-path="locations"]',
		markdownListSubmenu: '.secondary-navbar [data-list-path="markdowns"]',
		moneyListSubmenu: '.secondary-navbar [data-list-path="money"]',
		nameListSubmenu: '.secondary-navbar [data-list-path="names"]',
		numberarrayListSubmenu: '.secondary-navbar [data-list-path="number-arrays"]',
		numberListSubmenu: '.secondary-navbar [data-list-path="numbers"]',
		passwordListSubmenu: '.secondary-navbar [data-list-path="passwords"]',
		relationshipListSubmenu: '.secondary-navbar [data-list-path="relationships"]',
		selectListSubmenu: '.secondary-navbar [data-list-path="selects"]',
		textareaListSubmenu: '.secondary-navbar [data-list-path="textareas"]',
		textarrayListSubmenu: '.secondary-navbar [data-list-path="text-arrays"]',
		textListSubmenu: '.secondary-navbar [data-list-path="texts"]',
		urlListSubmenu: '.secondary-navbar [data-list-path="urls"]',

		// FIX ME NAV MENU
		datefieldmapListSubmenu: '.secondary-navbar [data-list-path="date-field-maps"]',
		dependsonListSubmenu: '.secondary-navbar [data-list-path="depends-ons"]',
		hiddenrelationshipListSubmenu: '.secondary-navbar [data-list-path="hidden-relationships"]',
		inlinerelationshipListSubmenu: '.secondary-navbar [data-list-path="inline-relationships"]',
		manyrelationshipListSubmenu: '.secondary-navbar [data-list-path="many-relationships"]',
		nodefaultcolumnListSubmenu: '.secondary-navbar [data-list-path="no-default-columns"]',
		sourcerelationshipListSubmenu: '.secondary-navbar [data-list-path="source-relationships"]',
		targetrelationshipListSubmenu: '.secondary-navbar [data-list-path="target-relationships"]',
	},
	commands: [{
		gotoHomeScreen: function() {
			return this
				.navigate();		// navigate to the configure Url
		},
		openMiscList: function(list) {
			var list = list.toLowerCase() + 'List';
			var listSubmenu = '@' + list + 'Submenu';
			return this.click('@miscListsMenu')
				.waitForListScreen()
				.click(listSubmenu)
				.waitForListScreen();
		},
		openFieldList: function(field) {
				var list = field.toLowerCase() + 'List';
				var listSubmenu = '@' + list + 'Submenu';
				return this.click('@fieldListsMenu')
					.waitForListScreen()
					.click(listSubmenu)
					.waitForListScreen();
		},
		signout: function() {
			this.api.pause(500);
			return this
				.waitForElementVisible('@logoutIcon')
				.click('@logoutIconLink')
				.waitForSigninScreen();
		},
		waitForSigninScreen: function(timeout) {
			return this
				.waitForElementVisible('@signinScreen', timeout || this.api.globals.waitForConditionTimeout);
		},
		waitForHomeScreen: function(timeout) {
			return this
				.waitForElementVisible('@homeScreen', timeout || this.api.globals.waitForConditionTimeout);
		},
		waitForInitialFormScreen: function(timeout) {
			return this
				.waitForElementVisible('@initialFormScreen', timeout || this.api.globals.waitForConditionTimeout);
		},
		waitForDeleteConfirmationScreen: function(timeout) {
			return this
				.waitForElementVisible('@deleteConfirmationScreen', timeout || this.api.globals.waitForConditionTimeout);
		},
		waitForResetConfirmationScreen: function(timeout) {
			return this
				.waitForElementVisible('@resetConfirmationScreen', timeout || this.api.globals.waitForConditionTimeout);
		},
		waitForListScreen: function(timeout) {
			return this
				.waitForElementVisible('@listScreen', timeout || this.api.globals.waitForConditionTimeout);
		},
		waitForItemScreen: function(timeout) {
			return this
				.waitForElementVisible('@itemScreen', timeout || this.api.globals.waitForConditionTimeout);
		},
	}],
};
