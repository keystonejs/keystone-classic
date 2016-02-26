module.exports = {
    before: function (browser) {
        browser
            .url('http://localhost:3000/keystone/users')
            .waitForElementVisible('div#signin-view')
            .assert.urlEquals('http://localhost:3000/keystone/signin?from=/keystone/users')
            .pause(1000);
    },
    after: function (browser) {
        browser
            .end();
    },
    'AdminUI should allow users to login and redirect to custom url': function (browser) {
        browser
            .setValue('input[name=email]', browser.globals.adminUILogin.email)
            .setValue('input[name=password]', browser.globals.adminUILogin.password)
            .click('button[type=submit]')
            .pause(1000)
            .assert.urlEquals('http://localhost:3000/keystone/users')
    }
};
