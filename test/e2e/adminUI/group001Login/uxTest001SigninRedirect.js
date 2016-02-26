module.exports = {
    before: function (browser) {
        browser
            .url(browser.globals.adminUI.url + 'users')
            .waitForElementVisible('div#signin-view')
            .assert.urlEquals(browser.globals.adminUI.url + 'signin?from=/keystone/users')
            .pause(1000);
    },
    after: function (browser) {
        browser
            .end();
    },
    'AdminUI should allow users to login and redirect to custom url': function (browser) {
        browser
            .setValue('input[name=email]', browser.globals.adminUI.login.email)
            .setValue('input[name=password]', browser.globals.adminUI.login.password)
            .click('button[type=submit]')
            .pause(1000)
            .assert.urlEquals(browser.globals.adminUI.url + 'users')
    }
};
