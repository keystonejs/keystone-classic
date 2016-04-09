module.exports = {
	url: 'http://localhost:3000/keystone/',
	pause: 1000,
	elements: {
		signinView: {
			selector: '#signin-view',
		},
		homeView: {
			selector: '#home-view',
		},
		listView: {
			selector: '#list-view'
		},
		homeIcon: {
			selector: '.primary-navbar [data-section-label="octicon-home"]',
		},
		homeIconLink: {
			selector: '.primary-navbar [data-section-label="octicon-home"] a',
		},
		accessMenu: {
			selector: '.primary-navbar [data-section-label="Access"]',
		},
		fieldsMenu: {
			selector: '.primary-navbar [data-section-label="Fields"]',
		},
		booleanFieldsSubmenu: {
			selector: '.secondary-navbar [data-list-path="booleans"]',
		},
		emailsFieldsSubmenu: {
			selector: '.secondary-navbar [data-list-path="emails"]',
		},
		namesFieldsSubmenu: {
			selector: '.secondary-navbar [data-list-path="names"]',
		},
		selectsFieldsSubmenu: {
			selector: '.secondary-navbar [data-list-path="selects"]',
		},
		frontPageIcon: {
			selector: '.primary-navbar [data-section-label="octicon-globe"]',
		},
		frontPageIconLink: {
			selector: '.primary-navbar [data-section-label="octicon-globe"] a',
		},
		logoutIcon: {
			selector: '.primary-navbar [data-section-label="octicon-sign-out"]',
		},
		logoutIconLink: {
			selector: '.primary-navbar [data-section-label="octicon-sign-out"] a',
		},
	},
	commands: [{
		pause: function(secs) {
			this.api.pause(secs || 1000);
			return this;
		},
		logout: function() {
			return this
				.click('@logoutIconLink')
				.waitForElementVisible('@signinView');
		},
	}],
};
