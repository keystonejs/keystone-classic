module.exports = {
  'Keystone should have a signin view' : function (client) {
    client
      .url('http://localhost:3000/keystone')
      .waitForElementVisible('div#signin-view', 3000)
      .pause(1000)
      .end();
  }
};