module.exports = {
  'Keystone should allow admins to login to the Admin UI' : function (client) {
    client
      .url('http://localhost:3000/keystone')
      .waitForElementVisible('div#signin-view', 3000)
      .setValue('input[name=email]', 'test@test.e2e')
      .setValue('input[name=password]', 'test')
      .click('button[type=submit]')
      .pause(1000)
      .waitForElementVisible('div#home-view', 1000)
      .pause(1000)
      .click('div#home-view > div > header > nav > div > ul.app-nav.app-nav--primary.app-nav--right > li:nth-child(2) > a')
      .pause(1000)
      .end();
  }
};