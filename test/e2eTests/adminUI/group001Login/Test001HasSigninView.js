module.exports = {
  'Keystone should have a signin view' : function (browser) {
	browser
	  .url('http://localhost:3000/keystone')
	  .waitForElementVisible('div#signin-view')
	  .pause(1000)
	  .end();
  }
};
