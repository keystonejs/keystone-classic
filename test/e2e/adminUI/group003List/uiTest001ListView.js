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
			.waitForElementVisible('#home-view')
			.pause(browser.globals.defaultPauseTimeout)
			.click('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(2) > a')
			.waitForElementVisible('#list-view')
			.pause(browser.globals.defaultPauseTimeout)
	},
	after: function (browser) {
		browser
			.click('#list-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li.active > a')
			.waitForElementVisible('#list-view')
			.pause(browser.globals.defaultPauseTimeout)
			.click('#list-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'List view must have a search bar': function (browser) {
		browser
			.click('#list-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li.active > a')
			.waitForElementVisible('#list-view');
		browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.InputGroup_section--grow.ListHeader__search > input')
				      .to.be.visible;
	},
	'List view must have a search button': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.InputGroup_section--grow.ListHeader__search > button')
				      .to.be.visible;
	},
	'List view must have a filter input': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.ListHeader__filter')
				      .to.be.visible;
	},
	'List view must have a column input': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.ListHeader__columns')
				      .to.be.visible;
	},
	'List view must have a download input': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.ListHeader__download')
				      .to.be.visible;
	},
	// TODO:  For some reason the expand table width input control does not show in saucelabs' Firefox 44...why?
	//		It shows fine with local selenium server and Firefox 44.0.2
	//'List view must have an expand table width input': function (browser) {
	//	browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.ListHeader__expand')
	//	browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.ListHeader__expand')
	//			      .to.be.visible;
	//},
	'List view must have a create list item button': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div.InputGroup.ListHeader__bar > div.InputGroup_section.ListHeader__create')
				      .to.be.visible;
	},
	'List view must have a Showing N items label': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div.ListHeader > div > div:nth-child(4) > div > div')
				      .to.be.visible;
	},
	'List view must have a name column header': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > thead > tr > th:nth-child(1)')
				      .to.be.visible;
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > thead > tr > th:nth-child(1)')
				      .text.to.equal('Name');
	},
	'List view must have an email column header': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > thead > tr > th:nth-child(2)')
				      .to.be.visible;
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > thead > tr > th:nth-child(2)')
				      .text.to.equal('Email');
	},
	'List view must have an Is Admin column header': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > thead > tr > th:nth-child(3)')
				      .to.be.visible;
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > thead > tr > th:nth-child(3)')
				      .text.to.equal('Is Admin');
	},
	'List view items must a delete icon': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > tbody > tr > td.ItemList__col--control.ItemList__col--delete > button')
				      .to.be.visible;
	},
	'List view user item must have a name value': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > a')
				      .to.be.visible;
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > a')
				      .text.to.equal('test e2e');
	},
	'List view user item must have a value in the email column': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > tbody > tr > td:nth-child(3) > a')
				      .to.be.visible;
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > tbody > tr > td:nth-child(3) > a')
				      .text.to.equal('test@test.e2e');
	},
	'List view user item must have a value in the Is Admin column': function (browser) {
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > tbody > tr > td:nth-child(4) > div')
				      .to.be.visible;
		browser.expect.element('#list-view > div > div.keystone-body > div > div:nth-child(2) > div > table > tbody > tr > td:nth-child(4) > div > span')
				      .to.be.visible;
	},
};
