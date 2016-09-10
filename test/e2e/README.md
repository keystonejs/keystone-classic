# End-2-End Functional Testing
This is an overview of the end-2-end UI/functional testing for keystone.  UI/functional tests ensure
regression coverage of all aspects of a real keystone application.  The tests use a real keystone
application with as much available configuration as possible.  Please note that this is not a
replacement for component-based unit testing, which attempt to do full regression coverage of all
the operations a particular component is responsible for.


## Setup
The setup is partly based on instructions at [nightwatchjs.org](http://nightwatchjs.org/guide#installation)
for nightwatch specific structure as well as partly based on a typical keystone app since the e2e test runs
with a real keystone app server.

    test/e2e
        global.js                               => common nightwatch test environment config

        server.js                               => keystone test app server

        adminUI                                 => adminUI e2e test suite
            nightwatch.json                     => nightwatch config
            pageObjects
                ...                             => page objects representing an AdminUI screen/page
            tests
                groupNNN<group-name>            => adminUI test group, where NNN is a group sequence number
                    uiTest<test-name>           => UI test suite
                    uxTest<test-name>           => UX/functional test suite

        drivers
            <browser drivers>                   => place holder directories for browser drivers

        updates                                 => all schema update/migration files
           0.0.1-updates-e2e.js                 => keystone updates

        models                                  => all test list models
           User.js                              => keystone user list model
           ...


## Running
Testing is a critical part of any keystone commit to ensure the commit has not introduced any
UI or functional regressions.  Make sure to run all keystone tests prior to pushing any commits.
If your commit fixes a bug but breaks the UI/functional test suite please make sure that you also
update the test suite so that any broken tests pass again.  You can run any of the following
from keystone's root directory:

    Pre-requisites:
        - Make sure that you have a Java JDK installed.  Minimum version is 7.
        - Make sure that you have Firefox (or Chrome) installed.  Firefox is the default browser used.
          Using Chrome requires specifying a different --env parameter (see below).  For any tests below
          you may replace the "--env default" parameter with one of the following:

            --env chrome, if you are on a linux 64-bit system
            --env chrome-linux32, if you are on a linux 32-bit system
            --env chrome-mac32, if you are on a mac system
            --env chrome-win32, if you are on a windows system

           You'll also have to download the chrome drivers from http://www.seleniumhq.org/download/
           Once you have downloaded them, you need to save these as:

            test/e2e/drivers/chrome/linux64/chromedriver, if you are on a linux 64-bit system
            test/e2e/drivers/chrome/linux32/chromedriver, if you are on a linux 32-bit system
            test/e2e/drivers/chrome/mac32/chromedriver, if you are on a mac system
            test/e2e/drivers/chrome/win32/chromedriver, if you are on a windows system

          For browser compatibility, see http://www.seleniumhq.org/about/platforms.jsp#browsers

        - Make sure that you have a local mongo instance running.
        - Make sure that port 3000 is available; if not please tell the e2e server what port it
          should bind to.  For example, to use port 9999 do the following (in a bash shell):

            export KEYSTONEJS_PORT=9999

        - Make sure to:

            export KEYSTONE_PREBUILD_ADMIN=true

    Running in your local environment using all defaults (good to do before doing a commit):

        npm run test-e2e

    If the above npm run command does not work for you then there are some issues with selenium and some platforms.
    Try the following instead:

        npm run test-e2e-bg

    If you are in active development and just want to run a single group in your local environment:

        node test/e2e/server.js --env default --config ./test/e2e/adminUI/nightwatch.json --group test/e2e/adminUI/tests/<group>

        or, if the above doesn't work in your platform try:

        node test/e2e/server.js --env default --selenium-in-background --config ./test/e2e/adminUI/nightwatch-no-process.json --group test/e2e/adminUI/tests/<group>

    Running a single test in your local environment:

        node test/e2e/server.js --env default --config ./test/e2e/adminUI/nightwatch.json --test test/e2e/adminUI/tests/<group>/<test>

        or, if the above doesn't work in your platform try:

        node test/e2e/server.js --env default --selenium-in-background --config ./test/e2e/adminUI/nightwatch-no-process.json --test test/e2e/adminUI/tests/<group>/<test>


    Travis builds will run:

        npm run test-e2e-saucelabs

    If you want to run the e2e keystone test app server standalone then run as follows:

        export KEYSTONEJS_PORT=9999 && node test/e2e/server.js --notest

    If you want to run the e2e keystone test app server standalone without dropping the database then run as follows:

        export KEYSTONEJS_PORT=9999 && node test/e2e/server.js --notest --nodrop


    This allows you to experiment with the exact same setup the test do!


## Add New Tests
You should consider adding new UI/UX/Functional tests if:

- you introduce new UI elements (e.g., a new field type).
- you introduce new client side functionality that may cause a different UX experience.
- you introduce new server side functionality that may cause a different UX experience.
- you fix a bug that's does not have UI/UX/Functional test coverage


## Writing The Tests
The best approach to writing new tests is to:

- use an existing one as an example.
- keep the test style consistent.
- keep the test file structure consistent.
- each test group must run on its own using the `--group` argument (that means, that each test within the group must undo
any changes it does to the state of the UI)
- each test within a group must run on its own using the `--test` argument (that means, that each test must undo
any changes it does to the state of the UI)
- when naming selectors (e.g., in adminUI.js) make sure to use a very descriptive name
- tests should make use of Page Object (see below for more on POs) commands to carry about the testing and should
    try as much as possible accessing Page Object elements directly.  As in an OO paradigm where you use methods
    to manipulate the data, likewise, in tests we should use PO commands to manipulate the page elements.

## Adding Field Tests

- add a model for the field to test/e2e/models/fields/<Field-Name>.js
- add the field collection to the fields nav in test/e2e/server.js
- add a test object for the field to test/e2e/fieldTestObjects
- add a test config for the field test list model to test/e2e/modelTestConfig
- add test<Field-Name>Field.js to test/e2e/adminUI/tests/group005Fields


## Some about nightwatch Page Objects(PO)
Since we use nightwatch Page Objects(PO) quite a bit in e2e then here are some notes to keep in mind:

NOTE:  For a more conceptual Page Object description see Martin Fowler's [here](http://martinfowler.com/bliki/PageObject.html)

- a PO is basically an abstraction of a view/page.  It defines:

    - elements and their selectors.  For example:

        elements: {
            elem1: 'a-selector-could-be-defined-via-a-simple-string'
        }
        or,
        elements: {
            elem1: {
                selector: 'a-selector-could-be-defined-via-the-selector-property-if-need-to-provide-a-strategy',
                locateStrategy: 'xpath',
            }
        }

    - commands.  For example:

        commands: [{
            waitForElem1ToShowUp: function () {
                return this
                    .waitForElementVisible('@elem1');
            },
        }],

- the tests `before:` function should define all POs the test will need to interact with.  For example:

    before: function (browser) {
        browser.spa = browser.page.spa();
        browser.spa.navigate();
    }

    then in tests you can access the spa PO as follows:

        browser.adminUIApp = browser.page.adminUIApp()

    in PO commands you can access the POs as follows:

        this.api.adminUIApp.click('@fieldsMenu')


# Existing Page Objects
The following Page Objects already exists and should be used in tests:

- adminUIApp.js -- this Page Object abstracts the testing for the admin UI SPA.  It only concerns itself with common test operations
    that apply to all SPA pages.
- homeScreen.js -- this Page Object abstracts the testing for the Admin UI Home page.
- dashBoardGroup.js -- this Page Object abstracts the testing of the Home Groups.
- dashBoardTab.js -- this Page Object abstracts the testing of the Home Group Tabs.
- homeScreen.js -- this Page Object abstracts the testing for the Admin UI Home page.
- listScreen.js -- this Page Object abstracts the testing for the Admin UI List page.
- itemScreen.js -- this Page Object abstracts the testing for the Admin UI Item page.
- initialForm.js -- this Page Object abstracts the testing for the initial modal create form.
- deleteConfirmation.js -- this Page Object abstracts the testing for the delete confirmation modal.
- resetConfirmation.js -- this Page Object abstracts the testing for the reset confirmation modal.


## Field Test Objects
In keystone we have come up with the concept of a Field Test Object.  These are similar to Nightwatch's Page Objects, 
except that we control the behavior and the execution of these ourselves.  Since every field should be part of a form, 
likewise, every field Test Object should be testable only via either the itemScreen form or the initial form Page Objects.
Please see the Field Test Object README under test/e2e/fieldTestObjects for more information on creating your own field
test objects.


## Model Test Configs
In keystone we have come up with the concept of a Model Test Config.  In a keystone application, a list model is used to
define the fields that make up the model.  Likewise, a Model Test Config is used to describe the Field Test Objects for
fields the keystone list model is composed of.  This is a powerful concept as you can also create Model Test Config for your
own application and plug into the keystone's test framework to test your app specific models!


## Testing Your Application Models
Keystone's e2e test framework can be used to test your own application's list models.
TODO:  provide instructions!!!