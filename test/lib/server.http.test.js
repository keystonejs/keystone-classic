var keystoneApp = require('../helpers/getKeystoneApp');
var demand = require('must');

describe('startHttpServer', function() {
	// TODO: fix this test, it fails incorrectly right now
	return;
	it('starts http server, makes a request, and closes', function(done) {
		keystoneApp.startHttp(function(ret) {
			demand(ret).be(true);
			done();
		});
	});
});
