module.exports = {
	before: function (browser) {
		browser
			.url(browser.globals.adminUI.url)
			.waitForElementVisible('#signin-view')
			.setValue('input[name=email]', browser.globals.adminUI.login.email)
			.setValue('input[name=password]', browser.globals.adminUI.login.password)
			.click('button[type=submit]')
			.pause(browser.globals.defaultPauseTimeout)
			.url(browser.globals.adminUI.url)
			.pause(browser.globals.defaultPauseTimeout)
			.click('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.url(browser.globals.adminUI.url)
			.pause(browser.globals.defaultPauseTimeout)
			.click('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Name field initial modal should be visible': function (browser) {
		browser.expect.element('body > div:nth-child(11) > div > div > div')
			.to.have.attribute('class').which.contains('Modal-content');
	},
	'Name field should be visible': function (browser) {
		browser.expect.element('body > div:nth-child(11) > div > div > div > form > div.Modal__body > div')
			.to.be.visible;
	},
	'Name field should be have a Name label': function (browser) {
		browser.expect.element('body > div:nth-child(11) > div > div > div > form > div.Modal__body > div > label')
			.text.to.equal('Name');
	},
	'Name field should be have a first name input box': function (browser) {
		browser.expect.element('body > div:nth-child(11) > div > div > div > form > div.Modal__body > div > div > div > div:nth-child(1) > input')
			.to.have.attribute('name').which.contains('name.first');
		browser.expect.element('body > div:nth-child(11) > div > div > div > form > div.Modal__body > div > div > div > div:nth-child(1) > input')
			.to.have.attribute('class').which.contains('FormInput');
	},
	'Name field should be have a last name input box': function (browser) {
		browser.expect.element('body > div:nth-child(11) > div > div > div > form > div.Modal__body > div > div > div > div:nth-child(2) > input')
			.to.have.attribute('name').which.contains('name.last');
		browser.expect.element('body > div:nth-child(11) > div > div > div > form > div.Modal__body > div > div > div > div:nth-child(2) > input')
			.to.have.attribute('class').which.contains('FormInput');
	},
};
