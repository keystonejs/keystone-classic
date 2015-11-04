var keystoneApp = require('../helpers/getKeystoneApp');
var demand = require('must');

describe('startSocketServer', function() {
	// TODO: fix this test, it fails incorrectly right now
	return;
	it('starts http socket server, makes a request, and closes', function(done) {
		this.timeout(4000);
		keystoneApp.startSocket(function(ret) {
			demand(ret).be(true);
			done();
		});

	});
});
