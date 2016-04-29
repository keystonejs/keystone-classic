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
		homeScreen: '#home-view',
		listScreen: '#list-view',
		itemScreen: '#item-view',
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
		codeListSubmenu: '.secondary-navbar [data-list-path="codes"]',
		colorListSubmenu: '.secondary-navbar [data-list-path="colors"]',
		emailListSubmenu: '.secondary-navbar [data-list-path="emails"]',
		nameListSubmenu: '.secondary-navbar [data-list-path="names"]',
		selectListSubmenu: '.secondary-navbar [data-list-path="selects"]',
		textListSubmenu: '.secondary-navbar [data-list-path="texts"]',
		textareaListSubmenu: '.secondary-navbar [data-list-path="textareas"]',
		urlListSubmenu: '.secondary-navbar [data-list-path="urls"]',
	},
	commands: [{
		signout: function() {
			this.api.pause(500);
			return this
				.waitForElementVisible('@logoutIcon')
				.click('@logoutIconLink')
				.waitForElementVisible('@signinScreen');
		},
	}],
};
