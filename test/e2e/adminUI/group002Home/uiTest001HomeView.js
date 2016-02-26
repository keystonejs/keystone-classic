module.exports = {
  before : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('div#signin-view')
	  .setValue('input[name=email]', browser.globals.adminUI.login.email)
	  .setValue('input[name=password]', browser.globals.adminUI.login.password)
	  .click('button[type=submit]')
	  .pause(1000)
	  .url(browser.globals.adminUI.url)
	  .pause(1000);
  },
  after : function (browser) {
	browser
	  .click('div#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
	  .pause(1000)
	  .end();
  },
  'AdminUI should have a home view' : function (browser) {
	browser.expect.element('div#home-view')
				  .to.be.visible;
  },
  'Home view should have a home link' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li.active > a > span')
				  .to.be.visible;
  },
  'Home view should have a home icon' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li.active > a > span')
		 		  .to.have.attribute('class').which.contains('octicon octicon-home');
  },
  'Home view should have an Access menu' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(2) > a')
				  .text.to.equal('Access');
  },
  'Home view should have an Fields menu' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(3) > a')
				  .text.to.equal('Fields');
  },
  'Home view should have a Front Page link' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(1) > a > span')
				  .to.be.visible;
  },
  'Home view should have a Front Page icon' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(1) > a > span')
				  .to.have.attribute('class').which.contains('octicon octicon-globe');
  },
  'Home view should have a Logout link' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a > span')
				  .to.be.visible;
  },
  'Home view should have a Logout icon' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a > span')
				  .to.have.attribute('class').which.contains('octicon octicon-sign-out');
  },
  'Home view should have a dashboard header' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-header > div')
				  .text.to.equal('e2e');
  },
  'Home view should have a Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__heading > span:nth-child(2)')
				  .text.to.equal('Access');
  },
  'Home view should have a Users tab under the Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-label')
				  .text.to.equal('Users');
  },
  'Home view should have a + link for the Users tab under the Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
				  .to.be.visible;
  },
  'Home view should have a + icon for the Users tab under the Access dashboard sub-heading ' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
				  .to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
  },
  'Home view should show 1 Item for the Users tab under the Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-count')
				  .text.to.equal('1 Item');
  },
  'Home view should have a Fields dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__heading > span:nth-child(2)')
				  .text.to.equal('Fields');
  },
  'Home view should have a Name Fields tab under the Fields dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-label')
				  .text.to.equal('Name Fields');
  },
  'Home view should have a + link for the Name Fields tab under the Fields dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
				  .to.be.visible;
  },
  'Home view should have a + icon for the Name Fields tab under the Fields dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
				  .to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
  },
  'Home view should show 0 Items for the Name Fields tab under the Fields dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-count')
				  .text.to.equal('0 Items');
  },
  'Home view should have a Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__heading > span:nth-child(2)')
				  .text.to.equal('Other');
  },
  'Home view should have a Other Lists tab under the Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-label')
				  .text.to.equal('Other Lists');
  },
  'Home view should have a + link for the Other Lists tab under the Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
				  .to.be.visible;
  },
  'Home view should have a + icon for the Other Lists tab under the Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus')
				  .to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
  },
  'Home view should show 0 Items for the Other Lists tab under the Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-count')
				  .text.to.equal('0 Items');
  },
};
