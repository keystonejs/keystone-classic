module.exports = {
  before : function (browser) {
	browser
	  .url('http://localhost:3000/keystone')
	  .waitForElementVisible('div#signin-view')
	  .setValue('input[name=email]', browser.globals.adminUILogin.email)
	  .setValue('input[name=password]', browser.globals.adminUILogin.password)
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
  'AdminUI items should have relationships' : function (browser) {
	  // TODO figure out field testing
  }
};
