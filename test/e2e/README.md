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


## Writing new tests
You should consider adding new UI/UX/Functional tests if:

- you introduce new UI elements (e.g., a new field type).
- you introduce new client side functionality that may cause a different UX experience.
- you introduce new server side functionality that may cause a different UX experience.
- you fix a bug that's does not have UI/UX/Functional test coverage

The best approach is to use an existing test as an example and try to
keep the test style consistent.  Lastly, please try to keep to the test file structure above.
