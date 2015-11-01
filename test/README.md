## Keystone Tests

#### Server
to test the ssl configuration you must tell node to ignore certificate errors
<kbd>NODE_TLS_REJECT_UNAUTHORIZED=0 mocha server.https.test.js </kbd>
