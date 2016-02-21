module.exports = {
  before : function (browser) {
	browser
	  .url('http://localhost:3000/keystone')
	  .waitForElementVisible('div#signin-view', 10000)
	  .setValue('input[name=email]', 'test@test.e2e')
	  .setValue('input[name=password]', 'test')
	  .click('button[type=submit]')
	  .pause(1000)
	  .url('http://localhost:3000/keystone')
	  .pause(1000);
  },
  after : function (browser) {
	browser
	  .click('div#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
	  .pause(1000)
	  .end();
  },
  'AdminUI should have a home view' : function (browser) {
	browser.expect.element('div#home-view').to.be.visible;
  },
  'Home view should have an Access menu' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(2) > a').text.to.equal('Access');
  },
  'Home view should have an Content menu' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--left > li:nth-child(3) > a').text.to.equal('Content');
  },
  'Home view should have a Front Page link' : function (browser) {
	browser.expect.element('#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(1) > a').to.be.visible;
  },
  'Home view should have a dashboard header' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-header > div').text.to.equal('e2e');
  },
  'Home view should have a Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__heading > span:nth-child(2)').text.to.equal('Access');
  },
  'Home view should have a Users tab under the Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-label').text.to.equal('Users');
  },
  'Home view should have a + icon for the Users tab under the Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus').to.be.visible;
  },
  'Home view should show 1 Item for the Users tab under the Access dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(1) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-count').text.to.equal('1 Item');
  },
  'Home view should have a Content dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__heading > span:nth-child(2)').text.to.equal('Content');
  },
  'Home view should have a Posts tab under the Content dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-label').text.to.equal('Posts');
  },
  'Home view should have a + icon for the Posts tab under the Content dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus').to.be.visible;
  },
  'Home view should show 0 Items for the Posts tab under the Content dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(2) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-count').text.to.equal('0 Items');
  },
  'Home view should have a Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__heading > span:nth-child(2)').text.to.equal('Other');
  },
  'Home view should have a Depends Ons tab under the Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-label').text.to.equal('Depends Ons');
  },
  'Home view should have a + icon for the Depends Ons tab under the Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__lists > div > span > a.dashboard-group__list-create.octicon.octicon-plus').to.be.visible;
  },
  'Home view should show 0 Items for the Depends Ons tab under the Other dashboard sub-heading' : function (browser) {
	browser.expect.element('#home-view > div > div > div > div.dashboard-groups > div > div:nth-child(3) > div.dashboard-group__lists > div > span > a.dashboard-group__list-tile > div.dashboard-group__list-count').text.to.equal('0 Items');
  },
};
