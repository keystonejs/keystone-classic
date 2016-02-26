module.exports = {
  before : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('div#signin-view')
	  .pause(1000);
  },
  after : function (browser) {
	browser
	  .end();
  },
  'AdminUI should have a signin view' : function (browser) {
	browser
	  .url(browser.globals.adminUI.url)
	  .waitForElementVisible('div#signin-view')
	  .pause(1000)
  },
  'Signin view should have an email field' : function (browser) {
	browser.expect.element('#signin-view > div > div.auth-box > div > div:nth-child(2) > form > div:nth-child(1) > input')
		 		  .to.have.attribute('type').which.contains('email');
	browser.expect.element('#signin-view > div > div.auth-box > div > div:nth-child(2) > form > div:nth-child(1) > input')
		 		  .to.have.attribute('name').which.contains('email');
	browser.expect.element('#signin-view > div > div.auth-box > div > div:nth-child(2) > form > div:nth-child(1) > input')
		 		  .to.have.attribute('class').which.contains('FormInput');
  },
  'Signin view should have an password field' : function (browser) {
	browser.expect.element('#signin-view > div > div.auth-box > div > div:nth-child(2) > form > div:nth-child(2)')
		 		  .to.have.attribute('class').which.contains('FormField');
	browser.expect.element('#signin-view > div > div.auth-box > div > div:nth-child(2) > form > div:nth-child(2)')
		 		  .to.have.attribute('for').which.contains('password');
  },
  'Signin view should have a submit button' : function (browser) {
	browser.expect.element('#signin-view > div > div.auth-box > div > div:nth-child(2) > form > button')
		 		  .to.have.attribute('class').which.contains('Button Button--primary');
	browser.expect.element('#signin-view > div > div.auth-box > div > div:nth-child(2) > form > button')
		 		  .to.have.attribute('type').which.contains('submit');
  },
};
