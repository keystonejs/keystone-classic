# End-2-End Functional Testing

The setup is based on instructions at [nightwatchjs.org](http://nightwatchjs.org/guide#installation)

## Setup

    keystone/bin/
        selenium-server-standalone-x.y.z.jar    => selenium driver
        
    test/e2e
        nightwatch.json                         => nightwatch config
        tests                                   => test groups
        
        server.js                               => keystone test app server
        models.js                               => test models
        updates.js                              => keystone updates
        
## Running
        
    npm run-script test-e2e
    
    