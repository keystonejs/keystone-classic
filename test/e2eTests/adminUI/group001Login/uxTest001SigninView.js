module.exports = {
  before : function (browser) {
	browser
	  .url('http://localhost:3000/keystone')
	  .waitForElementVisible('div#signin-view')
	  .pause(1000);
  },
  after : function (browser) {
	browser
	  .end();
  },
  'AdminUI should allow users to login' : function (browser) {
	browser
	  .setValue('input[name=email]', browser.globals.adminUILogin.email)
	  .setValue('input[name=password]', browser.globals.adminUILogin.password)
	  .click('button[type=submit]')
	  .pause(1000)
	  .url('http://localhost:3000/keystone')  // just in case we're redirected somewhere other than home page
	  .waitForElementVisible('div#home-view')
	  .pause(1000)
  },
  'AdminUI should allow users to logout' : function (browser) {
	browser
	  .click('div#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
	  .waitForElementVisible('div#signin-view')
	  .pause(1000);
  },
};
