module.exports = {
  'Keystone should allow admins to login to the Admin UI' : function (browser) {
	browser
	  .url('http://localhost:3000/keystone')
	  .waitForElementVisible('div#signin-view')
	  .setValue('input[name=email]', browser.globals.adminUILogin.email)
	  .setValue('input[name=password]', browser.globals.adminUILogin.password)
	  .click('button[type=submit]')
	  .pause(1000)
	  .url('http://localhost:3000/keystone')  // just in case we're redirected somewhere other than home page
	  .waitForElementVisible('div#home-view')
	  .pause(1000)
	  .end();
  }
};
