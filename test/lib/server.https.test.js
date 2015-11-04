var keystoneApp = require('../helpers/getKeystoneApp');
var demand = require('must');

describe('startHttpsServer', function() {
	it('starts ssl server, makes a request, and closes', function(done) {
		keystoneApp.startHttps(function(ret) {
			demand(ret).be(true);
			done();
		});
	});
});
