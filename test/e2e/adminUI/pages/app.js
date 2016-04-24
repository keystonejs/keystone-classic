/*
	This page object describes global admin UI configuration and commands that are or should be
	most likely available in all pages.
 */
module.exports = {
	url: 'http://localhost:3000/keystone/',
	pause: 1000,
	elements: {
		signinPage: '#signin-view',
		homePage: '#home-view',
		listPage: '#list-view',
		itemPage: '#item-view',
		initialFormPage: '.Modal-dialog',
		deleteConfirmationPage: '.Modal-dialog',
		resetConfirmationPage: '.Modal-dialog',
		homeIcon: '.primary-navbar [data-section-label="octicon-home"]',
		homeIconLink: '.primary-navbar [data-section-label="octicon-home"] a',
		accessMenu: '.primary-navbar [data-section-label="Access"]',
		fieldsMenu: '.primary-navbar [data-section-label="Fields"]',
		booleansFieldsSubmenu: '.secondary-navbar [data-list-path="booleans"]',
		emailsFieldsSubmenu: '.secondary-navbar [data-list-path="emails"]',
		namesFieldsSubmenu: '.secondary-navbar [data-list-path="names"]',
		selectsFieldsSubmenu: '.secondary-navbar [data-list-path="selects"]',
		frontPageIcon: '.primary-navbar [data-section-label="octicon-globe"]',
		frontPageIconLink: '.primary-navbar [data-section-label="octicon-globe"] a',
		logoutIcon: '.primary-navbar [data-section-label="octicon-sign-out"]',
		logoutIconLink: '.primary-navbar [data-section-label="octicon-sign-out"] a',
	},
	commands: [{
		gotoListPage: function(list) {
			return this
				.click('@fieldsMenu')
				.waitForElementVisible('@listPage')
				.click('@'+list+'FieldsSubmenu')
				.waitForElementVisible('@listPage');
		},
		signout: function() {
			this.api.pause(500);
			return this
				.waitForElementVisible('@logoutIcon')
				.click('@logoutIconLink')
				.waitForElementVisible('@signinPage');
		},
	}],
};
