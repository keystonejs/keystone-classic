/*
	This page object describes global admin UI configuration and commands that are or should be
	most likely available in all pages.
 */
module.exports = {
	url: 'http://localhost:3000/keystone/',
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
		booleanListSubmenu: '.secondary-navbar [data-list-path="booleans"]',
		cloudinaryimageListSubmenu: '.secondary-navbar [data-list-path="cloudinary-images"]',
		cloudinaryimagemultipleListSubmenu: '.secondary-navbar [data-list-path="cloudinary-image-multiples"]',
		codeListSubmenu: '.secondary-navbar [data-list-path="codes"]',
		colorListSubmenu: '.secondary-navbar [data-list-path="colors"]',
		dateListSubmenu: '.secondary-navbar [data-list-path="dates"]',
		datearrayListSubmenu: '.secondary-navbar [data-list-path="date-arrays"]',
		datetimeListSubmenu: '.secondary-navbar [data-list-path="datetimes"]',
		emailListSubmenu: '.secondary-navbar [data-list-path="emails"]',
		htmlListSubmenu: '.secondary-navbar [data-list-path="htmls"]',
		keyListSubmenu: '.secondary-navbar [data-list-path="keys"]',
		localfileListSubmenu: '.secondary-navbar [data-list-path="local-files"]',
		localfilemultipleListSubmenu: '.secondary-navbar [data-list-path="local-file-multiples"]',
		locationListSubmenu: '.secondary-navbar [data-list-path="locations"]',
		markdownListSubmenu: '.secondary-navbar [data-list-path="markdowns"]',
		moneyListSubmenu: '.secondary-navbar [data-list-path="money"]',
		nameListSubmenu: '.secondary-navbar [data-list-path="names"]',
		numberListSubmenu: '.secondary-navbar [data-list-path="numbers"]',
		passwordListSubmenu: '.secondary-navbar [data-list-path="passwords"]',
		selectListSubmenu: '.secondary-navbar [data-list-path="selects"]',
		textListSubmenu: '.secondary-navbar [data-list-path="texts"]',
		textareaListSubmenu: '.secondary-navbar [data-list-path="textareas"]',
		urlListSubmenu: '.secondary-navbar [data-list-path="urls"]',
	},
	commands: [{
		openFieldList: function(field) {
				var list = field.toLowerCase() + 'List';
				var listSubmenu = '@' + list + 'Submenu';
				return this.click('@fieldListsMenu')
					.waitForElementVisible('@listScreen')
					.click(listSubmenu)
					.waitForElementVisible('@listScreen');
		},
		signout: function() {
			this.api.pause(500);
			return this
				.waitForElementVisible('@logoutIcon')
				.click('@logoutIconLink')
				.waitForElementVisible('@signinScreen');
		},
		waitForSigninScreen: function() {
			return this
				.waitForElementVisible('@signinScreen');
		},
		waitForHomeScreen: function() {
			return this
				.waitForElementVisible('@homeScreen');
		},
		waitForInitialFormScreen: function() {
			return this
				.waitForElementVisible('@initialFormScreen');
		},
		waitForDeleteConfirmationScreen: function() {
			return this
				.waitForElementVisible('@deleteConfirmationScreen');
		},
		waitForResetConfirmationScreen: function() {
			return this
				.waitForElementVisible('@resetConfirmationScreen');
		},
		waitForListScreen: function() {
			return this
				.waitForElementVisible('@listScreen');
		},
		waitForItemScreen: function() {
			return this
				.waitForElementVisible('@itemScreen');
		},
	}],
};
