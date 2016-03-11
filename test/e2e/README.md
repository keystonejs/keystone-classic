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
        nightwatch.json                         => nightwatch config
        global.js                               => common nightwatch test environment config

        server.js                               => keystone test app server

        adminUI                                 => adminUI e2e test suite
            adminUI.js                          => adminUI test configuration (e.g., selectors, etc.)
            groupNNN<group-name>                => adminUI test group, where NNN is a group sequence number
                uiTestNNN<test-name>            => UI test suite, where NNN is a test sequence number
                uxTestNNN<test-name>            => UX/functional test suite, where NNN is a test sequence number

        bin                                     => any required e2e binaries
           selenium-server-standalone-x.y.z.jar => selenium driver for local testing

        updates                                 => all schema update/migration files
           0.0.1-updates-e2e.js                 => keystone updates

        models                                  => all test list models
           User.js                              => keystone user list model
           ...


## Running
Testing is a critical part of any keystone commit to ensure the commit has not introduced any
UI or functional regressions.  Make sure to run all keystone tests prior to pushing any commits.
If your commit fixes a bug but breaks the UI/functional test suite please make sure that you also
update the test suite so that any broken tests pass again.

    Running in your local environment with local selenium server:

        npm run test-e2e

    Travis builds will run:

        npm run test-e2e-saucelabs

    If you want to run the e2e keystone test app server standalone then run as follows:

        export KEYSTONEJS_PORT=9999 && node test/e2e/server.js --notest

    This allows you to experiment with the exact same setup the test do!


## Adding New Tests
You should consider adding new UI/UX/Functional tests if:

- you introduce new UI elements (e.g., a new field type).
- you introduce new client side functionality that may cause a different UX experience.
- you introduce new server side functionality that may cause a different UX experience.
- you fix a bug that's does not have UI/UX/Functional test coverage


## Test Organization
The best approach to keeping tests well organized is to:

- when writing new tests, use an existing one as an example.
- keep the test style consistent.
- keep the test file structure consistent.
- each test group must run on its own using the --group argument (that means, that each test within the group must undo
any changes it does to the state of the UI)
- each test within a group must run on its own using the --test argument (that means, that each test must undo
any changes it does to the state of the UI)
- when naming selectors (e.g., in adminUI.js) make sure to use a very descriptive name


## Adding Field Tests

- add a model for the field to e2e\models\fields\<Field-Name>.js
- add the field collection to the fields nav in e2e\server.js
- add the selectors for the field to e2e\adminUI\adminUI.js (need to add to both itemview.field and initialModalView.field)
- add uiTestNNN<Field-Name>Field.js to e2e\adminUI\group005Fields\
- add uxTestNNN<Field-Name>Field.js to e2e\adminUI\group005Fields\
