/*
	This page object describes global admin UI configuration and commands that are or should be
	most likely available in all pages.
 */
module.exports = {
	url: 'http://localhost:3000/keystone/',
	pause: 1000,
	elements: {
		signinScreen: '#signin-view',
		homeScreen: '#home-view',
		listScreen: '#list-view',
		itemScreen: '#item-view',
		initialFormScreen: '.Modal-dialog',
		deleteConfirmationScreen: '.Modal-dialog',
		resetConfirmationScreen: '.Modal-dialog',
		homeIcon: '.primary-navbar [data-section-label="octicon-home"]',
		homeIconLink: '.primary-navbar [data-section-label="octicon-home"] a',
		accessMenu: '.primary-navbar [data-section-label="Access"]',
		fieldsMenu: '.primary-navbar [data-section-label="Fields"]',
		booleansFieldsSubmenu: '.secondary-navbar [data-list-path="booleans"]',
		codesFieldsSubmenu: '.secondary-navbar [data-list-path="codes"]',
		colorsFieldsSubmenu: '.secondary-navbar [data-list-path="colors"]',
		emailsFieldsSubmenu: '.secondary-navbar [data-list-path="emails"]',
		namesFieldsSubmenu: '.secondary-navbar [data-list-path="names"]',
		selectsFieldsSubmenu: '.secondary-navbar [data-list-path="selects"]',
		textsFieldsSubmenu: '.secondary-navbar [data-list-path="texts"]',
		textareasFieldsSubmenu: '.secondary-navbar [data-list-path="textareas"]',
		frontPageIcon: '.primary-navbar [data-section-label="octicon-globe"]',
		frontPageIconLink: '.primary-navbar [data-section-label="octicon-globe"] a',
		logoutIcon: '.primary-navbar [data-section-label="octicon-sign-out"]',
		logoutIconLink: '.primary-navbar [data-section-label="octicon-sign-out"] a',
	},
	commands: [{
		gotoListScreen: function(list) {
			return this
				.click('@fieldsMenu')
				.waitForElementVisible('@listScreen')
				.click('@'+list+'FieldsSubmenu')
				.waitForElementVisible('@listScreen');
		},
		signout: function() {
			this.api.pause(500);
			return this
				.waitForElementVisible('@logoutIcon')
				.click('@logoutIconLink')
				.waitForElementVisible('@signinScreen');
		},
	}],
};
