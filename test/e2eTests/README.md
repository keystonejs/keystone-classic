# End-2-End Functional Testing

The setup is based on instructions at [nightwatchjs.org](http://nightwatchjs.org/guide#installation)

## Setup

    keystone/bin/
        selenium-server-standalone-x.y.z.jar    => selenium driver
        
    test/e2eTests
        nightwatch.json                         => nightwatch config
        testGroups                              => test groups
        
        server.js                               => keystone test app server
        updates.js                              => keystone updates
        
## Running
        
    npm run test-e2e
    
    