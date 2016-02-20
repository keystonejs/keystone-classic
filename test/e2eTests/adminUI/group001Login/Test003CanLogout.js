module.exports = {
  before : function (client) {
    client
      .url('http://localhost:3000/keystone')
      .waitForElementVisible('div#signin-view', 10000)
      .setValue('input[name=email]', 'test@test.e2e')
      .setValue('input[name=password]', 'test')
      .click('button[type=submit]')
      .pause(1000);
  },
  after : function (client) {
    client
      .end();
  },
  'Keystone should allow admins to logout from the Admin UI' : function (client) {
    client
      .url('http://localhost:3000/keystone')  // just in case we're redirected somewhere other than home page
      .waitForElementVisible('div#home-view', 10000)
      .click('div#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
      .waitForElementVisible('div#signin-view', 10000)
      .pause(1000);
  }
};